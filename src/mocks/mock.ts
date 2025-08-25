export const mockUser = { id: 1, name: "Kadu", email: "kadu@example.com" };

export const mockBalance = { userId: 1, amount: 12500.75, updatedAt: "2025-08-10T12:00:00Z" };

export type TxType = "TED" | "PIX";
export type Tx = {
  id: number;
  userId: number;
  type: TxType;
  beneficiaryName: string;
  amount: number;
  date: string;
  balanceAfter: number;
  cpfCnpj?: string;
  bank?: string;
  agency?: string;
  account?: string;
  key?: string;
};

export const mockTransactions: Tx[] = [
  {
    id: 101,
    userId: 1,
    type: "TED",
    beneficiaryName: "Maria Silva",
    cpfCnpj: "123.456.789-00",
    bank: "260 - Nu Pagamentos",
    agency: "0001",
    account: "123456-7",
    amount: 350.5,
    date: "2025-08-09T14:30:00Z",
    balanceAfter: 12150.25,
  },
  {
    id: 102,
    userId: 1,
    type: "PIX",
    beneficiaryName: "Maria Silva",
    key: "maria@email.com",
    amount: 79.9,
    date: "2025-08-11T09:10:00Z",
    balanceAfter: 12070.35,
  },
];
