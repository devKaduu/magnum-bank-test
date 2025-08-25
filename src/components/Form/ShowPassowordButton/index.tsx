import { Eye, EyeOff } from "lucide-react";
import type { ShowPasswordButtonProps } from "./props";

export function ShowPasswordButton({ isShow, ...rest }: ShowPasswordButtonProps) {
  return (
    <button type="button" {...rest}>
      {isShow ? (
        <EyeOff size={16} className="text-gray-400" />
      ) : (
        <Eye size={16} className="text-gray-400" />
      )}
    </button>
  );
}
