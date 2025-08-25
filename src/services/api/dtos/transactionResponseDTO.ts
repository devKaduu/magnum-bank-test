export interface TransactionResponse {
  id: string;
  userId: string;
  transferType: "pix" | "ted";
  cpfCnpj?: string | null;
  beneficiaryName: string;
  bank?: string | null;
  branch?: string | null;
  accountNumber?: string | null;
  pixKey?: string | null;
  amount: number;
  transactionDate: string;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  summary: string;
}
