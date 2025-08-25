import type { TransactionInput } from "../api/api";

export function validateTransaction(i: TransactionInput): string | null {
  if (!["pix", "ted"].includes(i.transferType)) return "Tipo inválido";
  if (!i.beneficiaryName?.trim()) return "Nome do favorecido é obrigatório";
  if (!i.amount || i.amount <= 0) return "Valor inválido";
  if (!i.transactionDate) return "Data é obrigatória";
  if (i.transferType === "pix") {
    if (!i.pixKey?.trim()) return "Chave PIX é obrigatória";
  } else {
    if (!i.bank?.trim()) return "Banco é obrigatório";
    if (!i.branch?.trim()) return "Agência é obrigatória";
    if (!i.accountNumber?.trim()) return "Conta é obrigatória";
  }
  return null;
}

export const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
