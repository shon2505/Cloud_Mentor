import { FutureTopic } from './platformTypes';

export const FUTURE_TOPICS: FutureTopic[] = [
  {
    id: 'ai-infrastructure-gpu',
    title: 'AI Infrastructure & High-Performance GPU Clusters',
    category: 'AI Infrastructure & Supercomputing',
    summary:
      'The cloud is rapidly re-architecting from general-purpose CPU virtualization to massive RDMA-interconnected GPU and TPU clusters optimized for distributed training and low-latency inference.',
    whyItMatters:
      'Modern frontier LLMs and diffusion models require thousands of GPUs (NVIDIA H100, B200, Google TPU v5p) communicating at microsecond latencies over ultra-fast 3.2 Tbps fabrics. Managing this infrastructure requires specialized networking and cluster orchestration skills.',
    currentApplications: [
      'Distributed training of foundation models across multi-node clusters',
      'High-throughput inference endpoints serving millions of queries per second',
      'Dynamic GPU resource scheduling using Kubernetes (Karpenter, Volcano, Ray)',
      'High-bandwidth storage tiering (Lustre, GPFS, S3 Express One Zone) to prevent GPU starvation',
    ],
    challengesAndAdoption: [
      'Extreme worldwide GPU shortages and unpredictable regional quota availability',
      'Massive power and thermal density requirements (up to 100kW per server rack)',
      'High failure rates of individual GPU components during weeks-long training runs',
    ],
    requiredSkills: [
      'Kubernetes GPU device plugins & operators (NVIDIA GPU Operator)',
      'Distributed compute frameworks (Ray, PyTorch Distributed, Slurm)',
      'InfiniBand and RoCE v2 high-speed RDMA networking',
      'Storage caching architectures to maintain high GPU saturation (>85% MFU)',
    ],
    starterProject: {
      title: 'Deploy an Open-Source LLM on Kubernetes with Autoscaling',
      description: 'Package and deploy an open-weights LLM (e.g. Llama-3-8B or Mistral) on a cloud GPU instance using vLLM and test inference latency.',
      deliverables: [
        'Write a Dockerfile and Kubernetes Deployment with NVIDIA GPU resource limits',
        'Configure vLLM with PagedAttention and FP8 quantization',
        'Set up Prometheus metrics to track GPU temperature, VRAM usage, and tokens/second',
        'Deploy a simple Next.js chat frontend communicating with your model endpoint',
      ],
    },
    careerPaths: ['AI Infrastructure Engineer', 'MLOps Engineer', 'High-Performance Computing (HPC) Specialist'],
    sourceAttribution: {
      source: 'NVIDIA GTC & AWS re:Invent AI Infrastructure Technical Keynotes',
      date: '2025',
      url: 'https://aws.amazon.com/ai/infrastructure/',
    },
  },
  {
    id: 'platform-engineering-idp',
    title: 'Platform Engineering & Internal Developer Platforms (IDPs)',
    category: 'DevOps & Cloud Operations',
    summary:
      'Organizations are moving away from ad-hoc DevOps tickets toward automated Internal Developer Platforms that offer standardized "Golden Paths" and self-service cloud infrastructure.',
    whyItMatters:
      'Instead of forcing every software developer to become a Kubernetes and Terraform expert, platform engineering teams design self-service developer portals (such as Spotify Backstage) with built-in security, compliance, and automated provisioning.',
    currentApplications: [
      'Self-service provisioning of secure cloud environments in under 3 minutes',
      'Centralized software catalogs tracking service ownership, dependencies, and health',
      'Automated ephemeral preview environments for every pull request',
      'Policy-as-code guardrails (Open Policy Agent, Kyverno) preventing insecure configurations',
    ],
    challengesAndAdoption: [
      'Cultural resistance: avoiding the platform being perceived as an inflexible mandate',
      'Treating the platform as an internal software product with user research and feedback loops',
      'Maintaining backward compatibility across dozens of legacy team codebases',
    ],
    requiredSkills: [
      'Infrastructure as Code (Terraform, OpenTofu, Crossplane)',
      'Developer Portal tooling (Backstage, Port, Cortex)',
      'Kubernetes Custom Resource Definitions (CRDs) and Operators',
      'CI/CD automation with GitHub Actions and ArgoCD GitOps',
    ],
    starterProject: {
      title: 'Build a Self-Service Cloud Microservice Generator',
      description: 'Build a GitHub Actions & Terraform template that allows any developer to click "Use Template" and automatically provision a serverless cloud backend with monitoring.',
      deliverables: [
        'Modular Terraform script provisioning an AWS Lambda or Cloud Run service with a custom domain',
        'Pre-configured CI/CD workflow that runs linting, tests, and automated deployment',
        'Integrated OpenTelemetry tracing and structured logging out of the box',
        'Documentation readme specifying SLA, cost profile, and operational runbook',
      ],
    },
    careerPaths: ['Platform Engineer', 'Principal DevOps Architect', 'Developer Experience (DevEx) Lead'],
    sourceAttribution: {
      source: 'CNCF Platform Engineering Working Group Whitepaper',
      date: '2025',
      url: 'https://tag-app-delivery.cncf.io/whitepapers/platform-eng/',
    },
  },
  {
    id: 'finops-cost-governance',
    title: 'FinOps: Cloud Financial Management & Cost Optimization',
    category: 'Cloud Economics & Governance',
    summary:
      'FinOps brings financial accountability to variable cloud spend, breaking down silos between engineering, finance, and product teams to maximize business value per dollar spent.',
    whyItMatters:
      'Gartner estimates that up to 30% of enterprise cloud spend is wasted on idle resources, oversized instances, and orphaned storage. FinOps has evolved into an indispensable engineering discipline driven by the FinOps Foundation FOCUS 1.0 open standard.',
    currentApplications: [
      'Real-time automated anomaly detection preventing runaway cloud bills',
      'Unit economics tracking (e.g. cloud cost per user signup or cost per API query)',
      'Automated rightsizing and spot-instance orchestration in staging/dev clusters',
      'Strategic procurement of Reserved Instances and flexible multi-year Savings Plans',
    ],
    challengesAndAdoption: [
      'Overcoming engineering inertia: encouraging developers to take ownership of their resource costs',
      'Attributing shared multi-tenant cluster costs (e.g. allocating EKS/GKE cluster expenses by namespace)',
      'Balancing aggressive cost-cutting with platform resilience and latency requirements',
    ],
    requiredSkills: [
      'Cloud billing data analysis (AWS Cost Explorer, Azure Cost Management, BigQuery export)',
      'Open Cost and Kubecost for Kubernetes workload cost allocation',
      'FOCUS (FinOps Open Cost and Usage Specification) schema',
      'Terraform Infracost integration for PR-level cost estimations',
    ],
    starterProject: {
      title: 'Automated Cloud Cost Audit & Infracost CI/CD Guardrail',
      description: 'Set up an automated auditing script that identifies idle EBS volumes, unattached Elastic IPs, and integrates Infracost into GitHub pull requests.',
      deliverables: [
        'Python/Boto3 script scanning an AWS account for unattached EBS disks and untagged resources',
        'GitHub Action running Infracost to post cost differentials on pull requests before merge',
        'Cost dashboard calculating potential monthly savings from rightsizing',
        'Executive summary report breaking down compute, storage, and networking waste',
      ],
    },
    careerPaths: ['FinOps Practitioner / Director', 'Cloud Economics Consultant', 'Cloud Optimization Architect'],
    sourceAttribution: {
      source: 'FinOps Foundation State of FinOps Report',
      date: '2025',
      url: 'https://www.finops.org/introduction/state-of-finops/',
    },
  },
  {
    id: 'zero-trust-confidential-computing',
    title: 'Confidential Computing & Zero-Trust Cloud Architecture',
    category: 'Security & Compliance',
    summary:
      'Hardware-based encrypted memory enclaves (AMD SEV-SNP, Intel SGX, AWS Nitro Enclaves) that protect sensitive data even while in use, coupled with identity-based microsegmentation.',
    whyItMatters:
      'Traditional security protected data at rest (disk encryption) and data in transit (TLS). Confidential computing closes the final frontier—protecting data in memory during computation—preventing cloud hypervisor administrators or unauthorized processes from snooping on sensitive data.',
    currentApplications: [
      'Multi-party privacy-preserving analytics and medical research collaboration',
      'Secure AI model weight protection and confidential inference on sensitive user data',
      'Cryptographic key custody and high-security financial transaction processing',
      'Strict Zero Trust Network Access (ZTNA) replacing legacy corporate VPNs',
    ],
    challengesAndAdoption: [
      'Hardware dependency on specific modern CPU generations (AMD EPYC, Intel Xeon, AWS Nitro)',
      'Modest performance overhead during cryptographic memory attestation',
      'Architectural redesign required to isolate sensitive code inside isolated enclaves',
    ],
    requiredSkills: [
      'Hardware cryptographic attestation and enclave runtimes',
      'Identity and Access Management (OIDC, OAuth 2.0, SPIFFE/SPIRE)',
      'Mutual TLS (mTLS) microservice communication via service meshes (Istio, Linkerd)',
      'Cloud compliance frameworks (SOC 2 Type II, HIPAA, PCI-DSS 4.0)',
    ],
    starterProject: {
      title: 'Implement SPIFFE/SPIRE Microservice Zero-Trust Mutual TLS',
      description: 'Deploy SPIRE on a local Kubernetes cluster to automatically issue cryptographic X.509 SVID identities to microservices and enforce mTLS without shared API keys.',
      deliverables: [
        'Deploy SPIRE Server and Agent on Kubernetes (Minikube or KinD)',
        'Register two microservices with unique SPIFFE IDs',
        'Configure mTLS communication where service A verifies service B identity cryptographically',
        'Document how this replaces hardcoded database passwords and static tokens',
      ],
    },
    careerPaths: ['Cloud Security Architect', 'DevSecOps Specialist', 'Confidential Computing Engineer'],
    sourceAttribution: {
      source: 'Confidential Computing Consortium & NIST Zero Trust Architecture (SP 800-207)',
      date: '2025',
      url: 'https://confidentialcomputing.io/',
    },
  },
  {
    id: 'edge-wasm-serverless',
    title: 'Edge Computing & WebAssembly (Wasm) Serverless Runtimes',
    category: 'Next-Generation Compute',
    summary:
      'Lightweight WebAssembly binaries executing on globally distributed edge networks, delivering sub-millisecond cold starts and near-native execution speed closer to end-users.',
    whyItMatters:
      'While standard Docker containers take hundreds of megabytes and 1-3 seconds to spin up, WebAssembly modules are under 1MB and instantiate in under 1 millisecond. This enables compute to be placed on every edge point of presence without prohibitive idle costs.',
    currentApplications: [
      'Ultra-low-latency API edge authentication and personalization at CDN edges',
      'Edge image resizing and dynamic format optimization (WebP/AVIF)',
      'Edge AI inference with quantized small language models running in Wasm runtimes',
      'Micro-frontends routed dynamically based on visitor geolocation and device type',
    ],
    challengesAndAdoption: [
      'WebAssembly System Interface (WASI) standard is still actively evolving',
      'Limited networking socket and thread primitives compared to standard POSIX OS environments',
      'Debugging distributed edge systems requires modern distributed tracing tooling',
    ],
    requiredSkills: [
      'Rust, Go, or TypeScript compiled to WebAssembly (Wasm/WASI)',
      'Edge platforms (Cloudflare Workers, Fastly Compute, Vercel Edge)',
      'Edge key-value stores (Workers KV, Upstash Redis) and distributed SQLite (D1, Turso)',
      'Edge routing, streaming responses, and Cache-Control header optimization',
    ],
    starterProject: {
      title: 'Deploy a Sub-5ms Geo-Distributed Edge API with Cloudflare Workers',
      description: 'Build an edge function written in TypeScript or Rust that validates JWT authentication tokens and returns personalized cached content with zero roundtrips to an origin server.',
      deliverables: [
        'Cloudflare Worker script written using Wrangler CLI',
        'Edge JWT verification using Web Crypto API',
        'Edge caching layer utilizing Cloudflare Cache API for instant 200 OK responses',
        'Benchmark analysis comparing latency from 5 worldwide locations against a centralized VM',
      ],
    },
    careerPaths: ['Edge Compute Engineer', 'Distributed Systems Architect', 'High-Performance Web Engineer'],
    sourceAttribution: {
      source: 'Bytecode Alliance & W3C WebAssembly Working Group',
      date: '2025',
      url: 'https://bytecodealliance.org/',
    },
  },
];
