import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { checkRateLimit } from '@/lib/rateLimit';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Normalizes custom GROQ_BASE URL if specified.
 * Strips `/chat/completions` or `/openai/v1` suffixes because groq-sdk
 * expects the domain root (e.g. `https://api.groq.com`) and automatically
 * appends `/openai/v1/chat/completions`.
 */
function normalizeGroqBase(url?: string): string | undefined {
  if (!url) return undefined;
  let base = url.trim().replace(/\/+$/, '');
  base = base.replace(/\/chat\/completions$/, '');
  base = base.replace(/\/openai\/v1$/, '');
  return base || undefined;
}

/**
 * POST /api/chat
 * Handles incoming chat messages with security, rate limiting, and domain-guarded streaming:
 * 1. Rate limiting & input hardening
 * 2. System prompt-guarded streaming completion with GROQ_MODEL (default: openai/gpt-oss-20b)
 */
export async function POST(req: NextRequest) {
  try {
    // ----------------------------------------------------
    // Rate Limiting (20 requests per minute per IP)
    // ----------------------------------------------------
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const waitSeconds = Math.ceil(rateLimit.resetInMs / 1000);
      return NextResponse.json(
        {
          error: `Rate limit reached. Please wait ${waitSeconds}s before asking your next question.`,
          code: 'RATE_LIMIT',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(waitSeconds),
          },
        }
      );
    }

    // ----------------------------------------------------
    // API Key Verification
    // ----------------------------------------------------
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('[API/Chat] Missing GROQ_API_KEY environment variable.');
      return NextResponse.json(
        {
          error:
            'Groq API key is not configured. Please add GROQ_API_KEY to your environment variables (.env.local).',
          code: 'CONFIG_ERROR',
        },
        { status: 500 }
      );
    }

    // ----------------------------------------------------
    // Input Hardening & Sanitization
    // ----------------------------------------------------
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request payload.', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages list is required and cannot be empty.', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // Sanitize message items: only allow 'user' and 'assistant' roles from the client
    const sanitizedMessages: { role: 'user' | 'assistant'; content: string }[] = [];
    for (const msg of messages) {
      if (
        typeof msg === 'object' &&
        msg !== null &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string'
      ) {
        sanitizedMessages.push({
          role: msg.role,
          content: msg.content.trim(),
        });
      }
    }

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid user or assistant messages found.', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const latestUserMessage = sanitizedMessages[sanitizedMessages.length - 1];
    if (latestUserMessage.role !== 'user' || !latestUserMessage.content) {
      return NextResponse.json(
        { error: 'The latest message must be a non-empty user message.', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // Max 2000 characters limit on the user query
    if (latestUserMessage.content.length > 2000) {
      return NextResponse.json(
        {
          error: `Message exceeds the 2,000 character limit (${latestUserMessage.content.length} chars). Please shorten your question.`,
          code: 'INVALID_INPUT',
        },
        { status: 400 }
      );
    }

    // Limit conversation context to the last 12 messages to keep latency low & token usage optimal
    const boundedHistory = sanitizedMessages.slice(-12);

    // Initialize Groq client with optional custom GROQ_BASE
    const customBase = normalizeGroqBase(process.env.GROQ_BASE);
    const groq = new Groq({
      apiKey,
      ...(customBase ? { baseURL: customBase } : {}),
    });

    // Model configuration (defaults to openai/gpt-oss-20b)
    const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

    // ----------------------------------------------------
    // Streaming Chat Completion with System Prompt
    // ----------------------------------------------------
    const completionStream = await groq.chat.completions.create({
      model,
      temperature: 0.4,
      max_tokens: 1200,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...boundedHistory.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
    });

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completionStream) {
            const token = chunk.choices?.[0]?.delta?.content || '';
            if (token) {
              controller.enqueue(encoder.encode(token));
            }
          }
          controller.close();
        } catch (streamError) {
          console.error('[API/Chat] Groq streaming error:', streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: unknown) {
    console.error('[API/Chat] Handler error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred while contacting the AI service.';

    return NextResponse.json(
      {
        error: errorMessage,
        code: 'UPSTREAM_ERROR',
      },
      { status: 500 }
    );
  }
}
