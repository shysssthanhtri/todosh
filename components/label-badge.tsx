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
