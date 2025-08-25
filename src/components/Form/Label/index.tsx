import { cn } from "../../../lib/utils";
import type { LabelProps } from "./props";

export function Label({ text, className, ...rest }: LabelProps) {
  return (
    <label className={cn("block text-sm font-medium text-gray-700", className)} {...rest}>
      {text}
    </label>
  );
}
