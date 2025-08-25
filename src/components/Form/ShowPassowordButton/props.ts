import type { ComponentProps } from "react";

export interface ShowPasswordButtonProps extends ComponentProps<"button"> {
  isShow: boolean;
}
