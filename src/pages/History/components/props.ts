export interface RowProps {
  tx: Tx;
}

type Tx = {
  id: string;
  type: "PIX" | "TED";
  date: string;
  beneficiary: string;
  value: number;
  balanceAfter?: number;
  dateMs?: number;
};
