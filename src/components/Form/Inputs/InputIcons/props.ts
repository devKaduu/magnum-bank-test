import type { ReactNode } from "react";
import type { InputProps } from "../Input/props";

export interface InputIconsProps extends InputProps {
  icon: ReactNode;
  rightButton?: ReactNode;
}
