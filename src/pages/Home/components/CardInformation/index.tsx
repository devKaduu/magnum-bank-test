import { cn } from "../../../../lib/utils";
import type { CardInformationProps } from "./props";

export function CardInformation({
  cardInformation: { title, value, description, typeValue },
  className,
  ...rest
}: CardInformationProps) {
  return (
    <div
      className={cn("bg-white rounded-xl p-6 shadow-sm border border-gray-200", className)}
      {...rest}
    >
      <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
      <div
        className={cn("text-2xl font-bold", {
          "text-green-600": typeValue === "positive",
          "text-red-600": typeValue === "negative",
        })}
      >
        {value}
      </div>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
}
