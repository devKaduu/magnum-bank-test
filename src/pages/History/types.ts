export type Tx = {
  id: string;
  type: "PIX" | "TED";
  date: string;
  beneficiary: string;
  value: number;
  balanceAfter?: number;
};

export interface ApiTx {
  amount: number;
  id: string;
  userId: string;
  transferType: "pix" | "ted";
  beneficiaryName: string;
  transactionDate: string;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  summary: string;
}
