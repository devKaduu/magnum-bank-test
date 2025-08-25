import { memo } from "react";
import { currencyPtBr } from "../../../utils/formatCurrency";
import type { RowProps } from "./props";

function RowComponent({ tx }: RowProps) {
  return (
    <tr className="border-gray-200 shadow-sm hover:bg-gray-50 transition">
      <td className="p-3 font-medium">{tx.type}</td>
      <td className="p-3">
        {new Date(tx.dateMs ?? new Date(tx.date).getTime()).toLocaleString("pt-BR")}
      </td>
      <td className="p-3">{tx.beneficiary}</td>
      <td className="p-3 text-red-magnum font-semibold">- R$ {currencyPtBr.format(tx.value)}</td>
      <td className="p-3">R$ {currencyPtBr.format(tx.balanceAfter ?? 0)}</td>
    </tr>
  );
}

export const Row = memo(RowComponent);
