import type { ComponentProps, ReactNode } from "react";

export interface InputCheckBoxProps extends ComponentProps<"input"> {
  description: ReactNode;
  error?: string;
}
