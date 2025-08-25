import type { ComponentProps } from "react";

export interface CardInformationProps extends ComponentProps<"div"> {
  cardInformation: CardInformationItem;
}

export interface CardInformationItem {
  title: string;
  value: string;
  description: string;
  typeValue: "positive" | "negative";
}
