import { Link } from "react-router-dom";
import type { CardActionsProps } from "./props";

export function CardActions({ label, icon, ...rest }: CardActionsProps) {
  return (
    <Link
      to="/transactions"
      className="cursor-pointer h-20 flex flex-col items-center justify-center space-y-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      {...rest}
    >
      {icon}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  );
}
