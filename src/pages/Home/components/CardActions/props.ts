import type { ReactNode } from "react";
import type { LinksProps } from "react-router-dom";

export interface CardActionsProps extends LinksProps {
  label: string;
  icon: ReactNode;
}
