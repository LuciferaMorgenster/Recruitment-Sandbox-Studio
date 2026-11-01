import { RolePreset } from '../types.ts';

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'staff-backend',
    label: 'Staff Backend / Distributed Systems Engineer',
    title: 'Staff Backend Engineer (Distributed Systems)',
    seniority: 'Staff / Principal',
    workplaceType: 'Remote (US/EU)',
    tone: 'Engineering-Centric & Ambitious',
    notes: `We desperately need a heavyweight engineer to own our real-time transaction processing pipeline.
Current system is hitting latency walls at 45k ops/sec. We're migrating core services from Python monolith to Go + Rust and Kafka.
Must-haves:
- Deep distributed systems chops, gossip protocols, consensus (Raft/Paxos), partition tolerance, event-driven architectures.
- 7+ years backend experience, at least 3+ in high-throughput low-latency systems.
- Production experience with Go, Rust, or modern C++, plus Kafka/Redpanda and PostgreSQL / CockroachDB.
- Strong opinions on telemetry, OpenTelemetry, p99 latency hunting, and chaos engineering.
- Soft skills: No brilliant jerks! Must be a calm mentor to junior/mid engineers, able to write clear RFCs, and lead cross-functional architecture reviews without defensive ego.
- Culture: Fast feedback loops, asynchronous default, high autonomy.
- Comp: $210k - $260k base + strong equity grant. Unlimited PTO, $4k home office stipend.`,
  },
  {
    id: 'founding-pm',
    label: 'Founding Product Manager (AI & Data)',
    title: 'Founding Product Manager (AI Applications)',
    seniority: 'Lead / Principal',
    workplaceType: 'Hybrid (San Francisco)',
    tone: 'Bold & High Growth',
    notes: `Series A startup backed by tier-1 VCs building workflow automation with agentic LLMs.
Need our 1st dedicated PM to work shoulder-to-shoulder with the founders and CTO.
What they'll actually do:
- Talk to 15+ design partners and enterprise pilots weekly to extract real user pain points, not just feature requests.
- Turn fuzzy customer feedback into razor-sharp PRDs, user stories, and prompt evaluation benchmarks.
- Own the roadmap from 0 to 1, balance enterprise security requirements with rapid AI iteration.
- Hard skills: Proven track record shipping modern B2B SaaS products, deep fluency with generative AI APIs/evals, SQL analytics, Figma prototyping.
- Soft skills: Extreme customer empathy, ruthlessness in prioritization ("saying no with grace"), high agency, crisp written communication.
- Need someone who thrives in ambiguity where the spec changes weekly based on pilot feedback.
- Package: $170k - $210k base + 0.75%-1.25% equity. Full health/dental, catered lunches.`,
  },
  {
    id: 'head-of-growth',
    label: 'Head of Growth Marketing (B2B SaaS)',
    title: 'Head of Growth & Demand Generation',
    seniority: 'Director / Head of',
    workplaceType: 'Remote (Global)',
    tone: 'Commercial & Data-Driven',
    notes: `Scaling from $3M to $12M ARR over the next 18 months.
Looking for an analytical growth leader who is equal parts performance marketer, experimenter, and pipeline architect.
Key responsibilities:
- Build and optimize multi-channel inbound pipeline: paid search/social (LinkedIn Ads, Google), programmatic SEO, developer evangelism.
- Run continuous landing page CRO and onboarding funnel experiments (post-signup activation rate is currently 14%, want to hit 25%).
- Partner closely with sales ops to tighten MQL-to-SQL handoffs and Hubspot attribution modeling.
- Hard skills: Full-stack marketing stack mastery (HubSpot, Google Analytics 4, Segment, Mixpanel, Clearbit, Webflow). Deep CAC/LTV math, payback period modeling.
- Soft skills: High resilience to failed experiments, ability to explain complex attribution models to non-marketers, rigorous bias for action.
- Target compensation: $180k - $220k base + performance bonus + significant stock options.`,
  },
  {
    id: 'sr-product-designer',
    label: 'Senior Product Designer (Design Systems & UX)',
    title: 'Senior Product Designer',
    seniority: 'Senior',
    workplaceType: 'Hybrid (New York)',
    tone: 'Warm & Design-Centric',
    notes: `Our fintech consumer & merchant mobile/web experience needs an empathetic, systems-minded designer.
Responsibilities:
- Overhaul our multi-brand design system in Figma with auto-layout, tokenization, and accessibility (WCAG AA).
- Conduct weekly user testing sessions, synthesize findings into customer journey maps.
- Partner seamlessly with iOS, Android, and web engineers to ensure design tokens translate into code 1:1.
- Hard requirements: 5+ years shipping complex consumer or fintech UI/UX. Mastery of Figma variables, prototyping (ProtoPie or Principle is a plus), micro-interactions.
- Soft requirements: High receptivity to constructive design critique, ability to articulate 'why' behind design decisions to executives, collaborative spirit.
- Comp: $155k - $190k + equity + flexible wellness benefits.`,
  },
];
