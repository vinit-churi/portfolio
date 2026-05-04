import {
  Network,
  Gauge,
  Database,
  LayoutGrid,
  LayoutDashboard,
  Terminal,
  Cpu,
  Server,
  Cloud,
  Code,
  Code2,
  Boxes,
  Box,
  GitBranch,
  Workflow,
  Zap,
  Activity,
  Layers,
  HardDrive,
  Hexagon,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  hub: Network,
  network: Network,
  speed: Gauge,
  gauge: Gauge,
  database: Database,
  storage: Database,
  view_quilt: LayoutGrid,
  layout: LayoutGrid,
  dashboard: LayoutDashboard,
  terminal: Terminal,
  cpu: Cpu,
  memory: Cpu,
  server: Server,
  cloud: Cloud,
  code: Code,
  code_blocks: Code2,
  packages: Boxes,
  package: Box,
  fork: GitBranch,
  workflow: Workflow,
  bolt: Zap,
  flash_on: Zap,
  activity: Activity,
  pulse: Activity,
  layers: Layers,
  hard_drive: HardDrive,
};

export function iconFor(name: string | undefined | null): LucideIcon {
  if (!name) return Hexagon;
  return MAP[name.toLowerCase()] ?? Hexagon;
}

export const ICON_OPTIONS = Object.keys(MAP);
