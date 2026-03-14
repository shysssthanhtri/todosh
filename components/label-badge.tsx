import { Badge } from "@/components/ui/badge";
import type { LabelItem } from "@/lib/indexeddb";
import type { LabelColor } from "@/schemas/label";

type Props =
  | {
      label: Pick<LabelItem, "name" | "color">;
      className?: string;
    }
  | {
      name: string;
      color?: LabelColor | null;
      className?: string;
    };

function getLabelColorClass(color: string | null | undefined): string {
  switch (color) {
    case "red":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "orange":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "yellow":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
    case "green":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
    case "teal":
      return "bg-teal-500/10 text-teal-500 border-teal-500/30";
    case "blue":
      return "bg-blue-500/10 text-blue-400 border-blue-500/40";
    case "indigo":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/30";
    case "purple":
      return "bg-purple-500/10 text-purple-500 border-purple-500/30";
    case "pink":
      return "bg-pink-500/10 text-pink-500 border-pink-500/30";
    case "gray":
      return "bg-muted text-muted-foreground border-muted-foreground/20";
    default:
      return "bg-muted text-muted-foreground border-muted-foreground/20";
  }
}

/** Fill color for charts (bars, etc.) — light background matching label badge (e.g. bg-*-500/10) */
export function getLabelFillColor(color: string | null | undefined): string {
  switch (color) {
    case "red":
      return "oklch(0.96 0.02 25)";
    case "orange":
      return "oklch(0.95 0.04 55)";
    case "yellow":
      return "oklch(0.95 0.05 85)";
    case "green":
      return "oklch(0.93 0.05 155)";
    case "teal":
      return "oklch(0.93 0.04 180)";
    case "blue":
      return "oklch(0.93 0.05 250)";
    case "indigo":
      return "oklch(0.92 0.05 275)";
    case "purple":
      return "oklch(0.93 0.05 300)";
    case "pink":
      return "oklch(0.94 0.05 350)";
    case "gray":
      return "var(--muted)";
    default:
      return "var(--muted)";
  }
}

/** Stroke/border color for chart bars — matches badge border (e.g. border-*-500/30) */
export function getLabelStrokeColor(color: string | null | undefined): string {
  switch (color) {
    case "red":
      return "var(--destructive)";
    case "orange":
      return "oklch(0.72 0.16 55)";
    case "yellow":
      return "oklch(0.75 0.15 85)";
    case "green":
      return "oklch(0.65 0.16 155)";
    case "teal":
      return "oklch(0.65 0.12 180)";
    case "blue":
      return "oklch(0.6 0.18 250)";
    case "indigo":
      return "oklch(0.55 0.2 275)";
    case "purple":
      return "oklch(0.6 0.2 300)";
    case "pink":
      return "oklch(0.65 0.2 350)";
    case "gray":
      return "var(--muted-foreground)";
    default:
      return "var(--muted-foreground)";
  }
}

export function LabelBadge(props: Props) {
  const { name, color, className } =
    "label" in props
      ? {
          name: props.label.name,
          color: props.label.color,
          className: props.className,
        }
      : props;

  return (
    <Badge
      variant="outline"
      className={`h-6 px-3 py-1 text-sm ${getLabelColorClass(
        color ?? null,
      )} ${className ?? ""}`}
    >
      {name}
    </Badge>
  );
}
