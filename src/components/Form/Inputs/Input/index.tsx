import { cn } from "../../../../lib/utils";
import type { InputProps } from "./props";

export function Input({ error, className, ...rest }: InputProps) {
  return (
    <>
      <input
        type="text"
        {...rest}
        className={cn(
          `w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-magnum focus:border-transparent`,
          className,
          error ? "border-red-500" : "border-gray-300"
        )}
      />
      {error && <p className="text-sm text-red-500 text-nowrap">{error}</p>}
    </>
  );
}
