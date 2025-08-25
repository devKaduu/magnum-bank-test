export interface TransactionRequestDTO {
  transferType: "ted" | "pix";
  cpfCnpj: string;
  beneficiaryName: string;
  bank: string;
  branch: string;
  accountNumber: string;
  pixKey: string;
  amount: string;
  transactionDate: string;
  password: string;
}
