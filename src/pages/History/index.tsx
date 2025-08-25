import { useEffect, useMemo, useState } from "react";
import { api, getStoredUser } from "../../api/api";
import { Row } from "./components";
import type { ApiTx, Tx } from "./types";

const fromCents = (cents: number) => Math.round(cents) / 100;
const toCents = (reais: string) => {
  const n = Number(reais.replace(/[^\d,.-]/g, "").replace(",", "."));
  return Math.round((isNaN(n) ? 0 : n) * 100);
};

export default function History() {
  const [type, setType] = useState<"ALL" | "TED" | "PIX">("ALL");
  const [period, setPeriod] = useState<"7" | "15" | "30" | "90" | "ALL">("ALL");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [valueStart, setValueStart] = useState<string>("");
  const [valueEnd, setValueEnd] = useState<string>("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr(null);
        setLoading(true);

        const params: Parameters<typeof api.listTx>[0] = {
          sort: order,
        };

        if (type !== "ALL") params.type = type.toLowerCase() as "pix" | "ted";
        if (period !== "ALL") params.presetDays = Number(period) as 7 | 15 | 30 | 90;
        if (dateStart) params.startDate = dateStart; // YYYY-MM-DD
        if (dateEnd) params.endDate = dateEnd;

        if (valueStart) params.minAmount = toCents(valueStart);
        if (valueEnd) params.maxAmount = toCents(valueEnd);

        const data: ApiTx[] = await api.listTx(params);

        if (!alive) return;

        const mapped: Tx[] = data.map((t) => ({
          id: t.id,
          type: t.transferType === "pix" ? "PIX" : "TED",
          date: t.transactionDate,
          beneficiary: t.beneficiaryName,
          value: fromCents(t.amount),
        }));

        setItems(mapped);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Erro ao carregar transações.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [type, period, dateStart, dateEnd, valueStart, valueEnd, order]);

  const itemsWithBalance = useMemo(() => {
    if (!items.length) return items;

    const current = getStoredUser<{ balance: number }>()?.balance ?? 0;

    const totalDebited = items.reduce((acc, t) => acc + Math.round(t.value * 100), 0);

    const initial = current + totalDebited;

    const asc = [...items].sort((a, b) => a.date.localeCompare(b.date));
    const balanceMap = new Map<string, number>();
    let running = initial;
    for (const t of asc) {
      running -= Math.round(t.value * 100);
      balanceMap.set(t.id, fromCents(running));
    }

    return items.map((t) => ({ ...t, balanceAfter: balanceMap.get(t.id) }));
  }, [items]);

  return (
    <div className="space-y-8 container mx-auto mt-8">
      <h1 className="text-3xl font-bold text-red-magnum">Histórico de Transações</h1>

      <div className="p-6 rounded-2xl border shadow-md border-gray-200 bg-white">
        <h2 className="font-semibold mb-4 text-lg">Filtros</h2>
        <div className="grid gap-4 md:grid-cols-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <select
              className="border-gray-200 border shadow-md rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-red-magnum"
              value={type}
              onChange={(e) => setType(e.target.value as "ALL" | "PIX" | "TED")}
            >
              <option value="ALL">Todos</option>
              <option value="PIX">PIX</option>
              <option value="TED">TED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Período</label>
            <select
              className="border-gray-200 border shadow-md rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-red-magnum"
              value={period}
              onChange={(e) => setPeriod(e.target.value as "ALL" | "7" | "15" | "30")}
            >
              <option value="ALL">Todos</option>
              <option value="7">7 dias</option>
              <option value="15">15 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data início</label>
            <input
              type="date"
              className="border-gray-200 border shadow-md rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-red-magnum"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Data fim</label>
            <input
              type="date"
              className="border-gray-200 border shadow-md rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-red-magnum"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Valor mín.</label>
            <input
              type="number"
              step="0.01"
              className="border-gray-200 border shadow-md rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-red-magnum"
              value={valueStart}
              onChange={(e) => setValueStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Valor máx.</label>
            <input
              type="number"
              step="0.01"
              className="border-gray-200 border shadow-md rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-red-magnum"
              value={valueEnd}
              onChange={(e) => setValueEnd(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium">Ordenar por data:</label>
          <select
            className="border-gray-200 border shadow-md rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-magnum"
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Mais recentes</option>
            <option value="asc">Mais antigas</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-red-magnum text-white">
            <tr>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Favorecido</th>
              <th className="p-3 text-left">Valor</th>
              <th className="p-3 text-left">Saldo após</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Carregando…
                </td>
              </tr>
            )}
            {err && !loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-red-600">
                  {err}
                </td>
              </tr>
            )}
            {!loading && !err && itemsWithBalance.map((tx) => <Row key={tx.id} tx={tx} />)}
            {!loading && !err && itemsWithBalance.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
