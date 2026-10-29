import { UserRoadmap, RoadmapPhase, CloudProviderId } from './platformTypes';

export const ROADMAP_STORAGE_KEY = 'cloudmentor_user_roadmap_v1';

export interface RoadmapGeneratorOptions {
  experienceLevel: string;
  provider: CloudProviderId;
  goal: string;
  weeklyHours: number;
  learningStyle: string;
}

export function generatePersonalizedRoadmap(options: RoadmapGeneratorOptions): UserRoadmap {
  const providerLabel =
    options.provider === 'aws'
      ? 'AWS'
      : options.provider === 'azure'
      ? 'Microsoft Azure'
      : options.provider === 'gcp'
      ? 'Google Cloud'
      : 'Multi-Cloud & Kubernetes';

  let title = `${providerLabel} Cloud Engineer Mastery Path`;
  let phases: RoadmapPhase[] = [];

  if (options.goal.includes('architect') || options.goal.includes('Solutions Architect')) {
    title = `${providerLabel} Solutions Architect Journey`;
    phases = [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Cloud Foundations & Core Architectural Principles',
        subtitle: 'Understand the shared responsibility model, regions, availability zones, and fundamental building blocks.',
        estimatedWeeks: 2,
        tasks: [
          {
            id: 'task-1-1',
            title: 'Master IaaS vs PaaS vs SaaS with Provider Mappings',
            description: 'Learn the architectural trade-offs between virtual machines, container platforms, and managed serverless.',
            resourceLink: 'https://explore.skillbuilder.aws/learn',
            completed: false,
            estimatedHours: 4,
          },
          {
            id: 'task-1-2',
            title: 'Understand Regions, Availability Zones & High Availability',
            description: 'Study how multi-AZ architectures prevent single points of failure (SPOF) and ensure business continuity.',
            completed: false,
            estimatedHours: 3,
          },
          {
            id: 'task-1-3',
            title: 'Set Up Root Account Security & Multi-Factor Authentication',
            description: 'Configure least privilege IAM policies, root MFA, and automated billing alert budgets.',
            completed: false,
            estimatedHours: 2,
          },
        ],
        checkpointAssessment: {
          question: 'In the Cloud Shared Responsibility Model, which component is strictly the customer responsibility in an IaaS environment (e.g. AWS EC2 or Azure VM)?',
          options: [
            'Physical data center building security and biometric locks',
            'Operating system patching, application software, and network firewall rules',
            'Hypervisor virtualization hardware maintenance',
            'Disposal of decommissioned hard drive storage arrays',
          ],
          correctIndex: 1,
          explanation: 'In IaaS, the cloud provider manages physical hardware, facilities, and the hypervisor. The customer is responsible for guest operating system patches, application configuration, firewall security groups, and customer data.',
        },
        capstoneProject: {
          title: 'Secure Account Baseline & Automated Billing Alarms',
          description: 'Deploy a hardened cloud root organization with MFA, separate development/production accounts, and automated AWS Budget alerts at 50%, 80%, and 100% of monthly budget.',
          keyDeliverables: [
            'Configured MFA on root user credentials',
            'IAM Identity Center administrator user with zero permanent access keys',
            'CloudWatch/Cost Management threshold notification linked to email/Slack',
          ],
        },
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Compute, Storage & High-Performance Data Stores',
        subtitle: 'Architect resilient server tiers and choose optimal databases for latency and throughput.',
        estimatedWeeks: 3,
        tasks: [
          {
            id: 'task-2-1',
            title: 'Deploy Elastic Compute with Auto Scaling & Load Balancer',
            description: 'Configure an Application Load Balancer distributing traffic across multiple instances in private subnets.',
            completed: false,
            estimatedHours: 6,
          },
          {
            id: 'task-2-2',
            title: 'Design Multi-Tier Object Storage & Lifecycle Policies',
            description: 'Implement object storage tiering (Standard -> Infrequent Access -> Archive) to reduce monthly storage costs by up to 70%.',
            completed: false,
            estimatedHours: 4,
          },
          {
            id: 'task-2-3',
            title: 'Provision Multi-AZ Managed Relational Database',
            description: 'Set up automated backups, read replicas for read scaling, and failover drills on PostgreSQL or MySQL.',
            completed: false,
            estimatedHours: 5,
          },
        ],
        checkpointAssessment: {
          question: 'When configuring a Multi-AZ deployment for Amazon RDS or Azure Database for PostgreSQL, how is data replicated to the standby replica?',
          options: [
            'Asynchronously every 24 hours during the maintenance window',
            'Synchronously, ensuring zero data loss if the primary instance fails',
            'Manually via user-triggered database export dumps',
            'Over the public internet using periodic SFTP cron jobs',
          ],
          correctIndex: 1,
          explanation: 'Multi-AZ deployments use synchronous physical replication across distinct availability zones to ensure data consistency and allow automatic failover without manual intervention.',
        },
        capstoneProject: {
          title: '3-Tier Scalable Web Application Architecture',
          description: 'Build a production-grade 3-tier architecture: public ALB tier, private auto-scaling compute tier, and isolated multi-AZ database tier with zero public IP exposure.',
          keyDeliverables: [
            'VPC with 2 public subnets and 4 private subnets across 2 Availability Zones',
            'Auto Scaling Group with health check replacement',
            'Multi-AZ RDS instance in isolated database subnets',
          ],
        },
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'Networking, Zero-Trust Security & Infrastructure as Code',
        subtitle: 'Automate deployments using Terraform and lock down private VPC networking.',
        estimatedWeeks: 3,
        tasks: [
          {
            id: 'task-3-1',
            title: 'Write Modular Terraform (IaC) for Reusable Environments',
            description: 'Define VPC, subnets, route tables, and security groups declaratively using Terraform / OpenTofu.',
            completed: false,
            estimatedHours: 8,
          },
          {
            id: 'task-3-2',
            title: 'Configure VPC Endpoints & PrivateLink',
            description: 'Route internal traffic to cloud services (S3, Secrets Manager) without traversing public internet gateways.',
            completed: false,
            estimatedHours: 5,
          },
          {
            id: 'task-3-3',
            title: 'Implement TLS Encryption & Automated Certificate Renewal',
            description: 'Configure CloudFront / CDN distribution with ACM SSL certificates and HTTP to HTTPS redirection.',
            completed: false,
            estimatedHours: 4,
          },
        ],
        checkpointAssessment: {
          question: 'What is the primary architectural benefit of utilizing VPC Endpoints (PrivateLink) instead of a NAT Gateway for connecting to object storage?',
          options: [
            'It slows down latency to provide better data packet inspection',
            'Traffic remains entirely within the cloud private backbone, avoiding internet exposure and NAT Gateway data processing fees',
            'It forces all database queries to be converted into static HTML files',
            'It requires external third-party VPN hardware installations',
          ],
          correctIndex: 1,
          explanation: 'VPC Gateway and Interface Endpoints keep network traffic strictly on the cloud provider private network backbone, improving throughput, lowering data transfer costs, and eliminating exposure to public internet transit.',
        },
        capstoneProject: {
          title: 'Complete GitOps-Driven Infrastructure Pipeline',
          description: 'Store infrastructure code in GitHub, validate via pull requests with automated terraform plan checks, and deploy to staging seamlessly.',
          keyDeliverables: [
            'GitHub Actions pipeline with terraform validate and security linter (TFLint/Checkov)',
            'Remote state locking with S3/GCS bucket and DynamoDB/state locking',
            'Automated rollback capability on failure',
          ],
        },
      },
      {
        id: 'phase-4',
        phaseNumber: 4,
        title: 'Production Readiness, Observability & Certification Prep',
        subtitle: 'Disaster recovery runbooks, distributed tracing, and exam readiness.',
        estimatedWeeks: 2,
        tasks: [
          {
            id: 'task-4-1',
            title: 'Set Up Centralized Logging & Distributed APM Tracing',
            description: 'Aggregate structured JSON logs and traces using OpenTelemetry, CloudWatch, or Datadog.',
            completed: false,
            estimatedHours: 5,
          },
          {
            id: 'task-4-2',
            title: 'Conduct Disaster Recovery & Backup Restore Drill',
            description: 'Simulate region or zone outage, calculate RTO/RPO metrics, and execute point-in-time database restoration.',
            completed: false,
            estimatedHours: 6,
          },
          {
            id: 'task-4-3',
            title: 'Complete Full-Length Certification Practice Exam',
            description: 'Take timed practice exam for AWS SAA-C03, Azure AZ-104, or GCP ACE and review weak domain scores.',
            completed: false,
            estimatedHours: 6,
          },
        ],
        checkpointAssessment: {
          question: 'What is the key difference between Recovery Time Objective (RTO) and Recovery Point Objective (RPO)?',
          options: [
            'RTO measures monetary cloud cost; RPO measures CPU temperature',
            'RTO is the maximum acceptable downtime to restore operations; RPO is the maximum acceptable data loss measured in time',
            'RTO applies only to databases; RPO applies only to web servers',
            'RTO and RPO are identical metrics used interchangeably',
          ],
          correctIndex: 1,
          explanation: 'RTO (Recovery Time Objective) defines how quickly systems must be restored after a disaster. RPO (Recovery Point Objective) defines the acceptable amount of data loss (e.g. data created in the last 15 minutes).',
        },
        capstoneProject: {
          title: 'Full Production Architecture Review & Well-Architected Audit',
          description: 'Document and present a complete enterprise workload audit against the 6 Well-Architected Framework pillars with cost estimates and risk mitigations.',
          keyDeliverables: [
            'Architectural diagram (Mermaid/Draw.io) showing multi-tier deployment and network routing',
            'FinOps budget analysis identifying top 3 cost optimization opportunities',
            'Security matrix verifying encryption at rest and in transit',
          ],
        },
      },
    ];
  } else {
    // Default / Cloud Engineer & DevOps path
    title = `${providerLabel} Cloud & DevOps Engineer Roadmap`;
    phases = [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Linux Fundamentals & Cloud Core Essentials',
        subtitle: 'Command line mastery, networking fundamentals, and cloud concepts.',
        estimatedWeeks: 2,
        tasks: [
          {
            id: 'task-d-1',
            title: 'Master Linux Shell, File Permissions & SSH Key Pairs',
            description: 'Become fluent in bash scripting, grep, systemd service management, and secure SSH key forwarding.',
            completed: false,
            estimatedHours: 5,
          },
          {
            id: 'task-d-2',
            title: 'Cloud Core Concepts: Compute, Storage & IAM',
            description: 'Learn how cloud providers virtualize compute, block storage, and handle user authentication.',
            completed: false,
            estimatedHours: 4,
          },
        ],
        checkpointAssessment: {
          question: 'Which Linux command securely changes permissions on an SSH private key so that the SSH client allows connecting to a cloud instance?',
          options: ['chmod 777 id_rsa', 'chmod 400 id_rsa', 'chown root id_rsa', 'rm -rf id_rsa'],
          correctIndex: 1,
          explanation: 'SSH requires that private keys are readable only by the owner (read-only 400 or read-write 600). Open permissions like 777 will cause SSH to reject the key for security reasons.',
        },
        capstoneProject: {
          title: 'Automated Cloud Instance Bootstrapping Script',
          description: 'Create a Cloud-Init / User-Data script that automatically updates OS packages, configures firewall rules, and launches a secure Nginx reverse proxy on boot.',
          keyDeliverables: ['Tested user-data bash script', 'Working Nginx instance serving SSL traffic', 'SSH access restricted to specific IP'],
        },
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Containers, Docker & Microservices Packaging',
        subtitle: 'Containerize web apps and optimize Docker images for security and size.',
        estimatedWeeks: 3,
        tasks: [
          {
            id: 'task-d-3',
            title: 'Write Multi-Stage Production Dockerfiles',
            description: 'Use multi-stage builds (distroless/Alpine) to reduce image sizes from 1GB to under 80MB and eliminate CVE vulnerabilities.',
            completed: false,
            estimatedHours: 6,
          },
          {
            id: 'task-d-4',
            title: 'Push Images to Cloud Container Registries (ECR/ACR/Artifact Registry)',
            description: 'Configure automated image scanning and vulnerability alerts on container push.',
            completed: false,
            estimatedHours: 4,
          },
        ],
        checkpointAssessment: {
          question: 'Why are multi-stage Docker builds recommended for production cloud container images?',
          options: [
            'They duplicate source code across multiple hard drives',
            'They separate build-time compilers and dependencies from the final lean runtime container, minimizing attack surface and image size',
            'They disable container networking for high security',
            'They automatically write code for the developer',
          ],
          correctIndex: 1,
          explanation: 'Multi-stage Docker builds allow you to use heavy SDKs and compilers in the build stage, then copy only the compiled binary or production bundle into a minimal runtime image, saving disk space and eliminating security vulnerabilities.',
        },
        capstoneProject: {
          title: 'Secure Microservice Container with Automated CVE Scans',
          description: 'Containerize a Node.js or Python API using a non-root user, multi-stage build, and push to an encrypted cloud container registry with zero critical vulnerabilities.',
          keyDeliverables: ['Optimized Dockerfile (<100MB)', 'Trivy/Docker Scout vulnerability scan report', 'Pushed image in private cloud registry'],
        },
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'Kubernetes Orchestration & Serverless Deployments',
        subtitle: 'Deploy and autoscale microservices on Kubernetes or serverless container runtimes.',
        estimatedWeeks: 3,
        tasks: [
          {
            id: 'task-d-5',
            title: 'Master Kubernetes Pods, Deployments & Services',
            description: 'Write declarative Kubernetes manifests defining rolling updates, resource requests/limits, and liveness probes.',
            completed: false,
            estimatedHours: 8,
          },
          {
            id: 'task-d-6',
            title: 'Deploy Serverless Containers (Cloud Run or AWS Fargate)',
            description: 'Run containerized workloads with scale-to-zero capabilities and automatic HTTPS certificate provisioning.',
            completed: false,
            estimatedHours: 5,
          },
        ],
        checkpointAssessment: {
          question: 'In Kubernetes, what is the role of a Liveness Probe versus a Readiness Probe?',
          options: [
            'Liveness probes track CPU temperature; Readiness probes track memory usage',
            'Liveness determines if a container needs to be restarted; Readiness determines if a container is ready to receive network traffic',
            'Both probes perform the exact same action and are redundant',
            'Readiness probes delete the container immediately upon deployment',
          ],
          correctIndex: 1,
          explanation: 'A Liveness probe detects when an application is stuck or deadlocked and restarts the container. A Readiness probe checks if the app is ready to accept traffic (e.g. database connection initialized) before routing requests to it.',
        },
        capstoneProject: {
          title: 'High-Availability Kubernetes Microservice with HPA',
          description: 'Deploy a microservice to a managed Kubernetes cluster (EKS/AKS/GKE) with Horizontal Pod Autoscaler (HPA), Ingress TLS, and automated rolling updates.',
          keyDeliverables: [
            'Kubernetes Deployment YAML with CPU/Memory limits and readiness/liveness probes',
            'Configured Horizontal Pod Autoscaler (scales from 2 to 10 pods under stress)',
            'Ingress Controller with automated Let’s Encrypt TLS certificate',
          ],
        },
      },
      {
        id: 'phase-4',
        phaseNumber: 4,
        title: 'CI/CD Pipelines, GitOps & Production Monitoring',
        subtitle: 'End-to-end automation from git commit to live production rollout.',
        estimatedWeeks: 2,
        tasks: [
          {
            id: 'task-d-7',
            title: 'Build GitHub Actions CI/CD with Zero Downtime Rollout',
            description: 'Automate testing, container building, vulnerability scanning, and deployment on pull request merge.',
            completed: false,
            estimatedHours: 6,
          },
          {
            id: 'task-d-8',
            title: 'Set Up Prometheus & Grafana Monitoring Dashboards',
            description: 'Track request rate, error rate, and duration (RED metrics) with automated alerting to Slack/Discord.',
            completed: false,
            estimatedHours: 5,
          },
        ],
        checkpointAssessment: {
          question: 'What is the core principle of GitOps (e.g. using ArgoCD or Flux)?',
          options: [
            'Manually SSHing into production servers to apply hotfixes directly',
            'Git is the single source of truth for desired infrastructure state, with automated reconciliation keeping the cluster in sync',
            'Never writing automated tests for cloud infrastructure',
            'Storing plain-text passwords directly in public GitHub repositories',
          ],
          correctIndex: 1,
          explanation: 'GitOps uses Git repositories as the authoritative source of truth for infrastructure and application configuration. Automated agents inside the cluster pull and reconcile any differences between Git and the live cluster state.',
        },
        capstoneProject: {
          title: 'Complete DevOps Capstone: Automated GitOps Pipeline',
          description: 'Create an end-to-end GitOps pipeline: push code -> GitHub Actions builds container -> updates GitOps manifest repo -> ArgoCD synchronizes live cluster without downtime.',
          keyDeliverables: [
            'GitHub repository with automated CI workflow',
            'Working GitOps deployment synchronization',
            'Live Grafana dashboard monitoring latency and error rates',
          ],
        },
      },
    ];
  }

  return {
    id: `roadmap-${Date.now()}`,
    title,
    goal: options.goal,
    provider: options.provider,
    experienceLevel: options.experienceLevel,
    weeklyHours: options.weeklyHours,
    learningStyle: options.learningStyle,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    phases,
    completedTaskIds: [],
    passedCheckpoints: [],
  };
}

export function loadSavedRoadmap(): UserRoadmap | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ROADMAP_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse saved roadmap:', err);
    return null;
  }
}

export function saveUserRoadmap(roadmap: UserRoadmap): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify({ ...roadmap, updatedAt: Date.now() }));
  } catch (err) {
    console.error('Failed to save roadmap:', err);
  }
}

export function clearSavedRoadmap(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ROADMAP_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear roadmap:', err);
  }
}
