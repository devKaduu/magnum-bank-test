import { ArrowDownLeft } from "lucide-react";
import { formatBRL } from "../../../../mocks/validators";
import type { TransactionItemProps } from "./props";

export function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <div
      key={transaction.id}
      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
    >
      {/* Ícone e infos */}
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600`}
        >
          <ArrowDownLeft className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-gray-900 "> {transaction.description}</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500">
              {new Date(transaction.createdAt).toLocaleString("pt-BR")}
            </p>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full uppercase">
              {transaction.transferType}
            </span>
          </div>
        </div>
      </div>

      {/* Valor */}
      <div className={`font-semibold text-red-600`}>- R$ {formatBRL(transaction.amount)}</div>
    </div>
  );
}
