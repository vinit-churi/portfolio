import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { db } from "./db";
import {
  heroConfig,
  journalArticles,
  activityLedger,
  activityStats,
  workRoles,
  expertiseItems,
} from "./schema";

async function seed() {
  console.log("Seeding database...");

  await db.insert(heroConfig).values({
    id: 1,
    availabilityLabel: "Available for complex scale",
    isAvailable: true,
    tagline: "Curiosity-driven engineering. Building for resilience and precision.",
    bio: "Specializing in low-latency infrastructure and distributed data orchestration. I architect systems that don't just function—they endure.",
    infraLabel: "Infrastructure",
    infraStack: "AWS / K8s / Terraform",
    coreLabel: "Core Stack",
    coreStack: "Go / Rust / PostgreSQL",
    liveStatusText: "Currently building: High-performance distributed key-value store in Rust",
    clusterStatusText: "All Systems Nominal",
    clusterPercentage: 80,
  }).onConflictDoNothing();

  await db.insert(journalArticles).values([
    {
      date: "May 10, 2024",
      tag: "Scale",
      title: "The Cost of Consistency: Raft vs Paxos in Production",
      excerpt: "A deep dive into distributed consensus protocols and their real-world latency trade-offs...",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5EvBChHpRWd5tR1TY3iBwSyToaxn8KGMW9xBoFKyjN4CCYjRiGbmjTiSUYtskbgr1O4jlGDoeW1JMkaGojOgQnVvHejQTvZ-OjycN5eGOvLxxAgQuuKcV_v91nD80nEWnk_t1rcN2YT06t3FosrP2Gmx2NBY4kDHIgPhvaTGZrG120gAcp647Pj0eSNTQmG-uRZhKRYTjRvqnQL3XosdusQvkbN76tmVm0wXPNGaBCueYn65ZKdtUyWe90wuHBeoIzdQTh9wgOhQ",
      imageAlt: "Microscopic view of crystalline structures in black and white",
      sortOrder: 0,
    },
    {
      date: "April 22, 2024",
      tag: "Optimization",
      title: "Zero-Allocation Data Parsing in Go",
      excerpt: "How to leverage buffer pools and unsafe pointers to squeeze every bit of performance from your parsers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn9rsjMeElaVF-RtxtlRorA7Tusu_gGegtZedGSDqNzZMLlsFTrqh1AJYt3bJ4LU4PHEJC8yHlLo2e7ujIMPNL2USXAWvGqJ2DE3RzdvaWaNNQiHWyQZPzDvESgCKawjVfeMCEKfJ7ATBLEv9s8Pil3kPkiXy2vPZduT9jt9JOiIFPkwzd4LrzizfLJPcsV_1SCHfjWTA-5-OACPchuetsG3QNV8r6O1xE26E5eMUjskGdPOTb2nGFo1_QJmfw0CWF1To2o_NT2hs",
      imageAlt: "Abstract architectural photography of a minimalist concrete building",
      sortOrder: 1,
    },
    {
      date: "March 05, 2024",
      tag: "Design",
      title: "Designing Resilient API Contracts with ProtoBuf",
      excerpt: "The architecture of evolution: avoiding breaking changes in high-velocity microservice environments.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLaFkIr2RGz9brsUYZSeth89J0TUDhfwWp81NNeaOy4WVmXBHYe3CzULlHYZo0WOyf28r_nXr526sHbEUCeeBiywVoN4430Jh9PeIin3sb3qu1zr4CJqGvkBe9eaE_K-Tb0ePnSkRczvF-DcSAe8xnlKtbSgJwilJTxgHLXwOPx7raAz7ln9EcYWd5ZzTZ2zB8aLbiugyhsaDhmB2fJzIZMfsx_eADLYkpuDcl7PYEv47qrYQCKC474eQLcp2r5NZwvtaIQqHuMcg",
      imageAlt: "Macro photo of circuit board paths glowing with faint electrical light",
      sortOrder: 2,
    },
  ]).onConflictDoNothing();

  await db.insert(activityLedger).values([
    { date: "2024-05-12", title: "Deployed Sharding Logic", description: "Reduced write latency by 45% for global regions.", active: true, sortOrder: 0 },
    { date: "2024-04-28", title: "OS Contribution: Go-Raft", description: "Merged PR for leader election timeout optimizations.", active: false, sortOrder: 1 },
    { date: "2024-03-15", title: "Infrastructure Migrated", description: "Completed full EKS transition for core services.", active: false, sortOrder: 2 },
  ]).onConflictDoNothing();

  await db.insert(activityStats).values([
    { label: "Uptime Commit", value: "99.98%", sortOrder: 0 },
    { label: "Pull Requests", value: "412", sortOrder: 1 },
    { label: "Total Stars", value: "1.2k", sortOrder: 2 },
    { label: "System Load", value: "0.02ms", sortOrder: 3 },
  ]).onConflictDoNothing();

  await db.insert(workRoles).values([
    { period: "2021 — PRESENT", title: "Principal Backend Engineer @ QuantLogix", description: "Spearheading the core matching engine rewrite in Rust, achieving sub-millisecond execution times. Managed a team of 12 engineers across 3 timezones.", sortOrder: 0 },
    { period: "2018 — 2021", title: "Senior Systems Architect @ DataLayer", description: "Designed and implemented a distributed event-streaming platform handling 50TB of daily telemetry data using Kafka and Go.", sortOrder: 1 },
    { period: "2015 — 2018", title: "Software Engineer @ OpenSource Foundries", description: "Early contributor to several CNCF projects. Focused on container runtime security and eBPF observability tools.", sortOrder: 2 },
  ]).onConflictDoNothing();

  await db.insert(expertiseItems).values([
    { icon: "hub", title: "Distributed Systems", description: "High-availability microservices architecture with gRPC and event-driven patterns.", tags: JSON.stringify(["Raft", "Kafka"]), bg: "bg-surface", sortOrder: 0 },
    { icon: "speed", title: "High Concurrency", description: "Optimization of data pipelines processing 1M+ req/sec using lock-free structures.", tags: JSON.stringify(["Goroutines", "Redis"]), bg: "bg-surface-container-low", sortOrder: 1 },
    { icon: "database", title: "Data Science & Integrations", description: "Complex ETL processes and vector database implementation for LLM contexts.", tags: JSON.stringify(["Pinecone", "Spark"]), bg: "bg-surface", sortOrder: 2 },
    { icon: "view_quilt", title: "Modern Frontend", description: "Internal tooling using React and Tailwind with deep state management focus.", tags: JSON.stringify(["Next.js", "Zustand"]), bg: "bg-surface-container-low", sortOrder: 3 },
  ]).onConflictDoNothing();

  console.log("Done.");
}

seed().catch(console.error);
