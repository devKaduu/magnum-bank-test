export interface TransactionViewModel {
  beneficiaryName: string;
  createdAt: string;
  id: string;
  date: string;
  description: string;
  amount: number;
  transferType: "pix" | "ted";
}
