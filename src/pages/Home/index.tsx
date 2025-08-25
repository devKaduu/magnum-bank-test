import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CardActions } from "./components/CardActions";
import { CardInformation } from "./components/CardInformation";
import { TransactionItem } from "./components/TransactionItem";

import { api } from "../../api/api";
import { formatBRL } from "../../mocks/validators";
import type { TransactionResponse } from "../../services/api/dtos/transactionResponseDTO";
import { cardInformation } from "./const";
import type { TransactionViewModel } from "./types";

function mapTxToUI(tx: TransactionResponse): TransactionViewModel {
  return {
    id: tx.id,
    date: tx.transactionDate || tx.createdAt.slice(0, 10),
    description: tx.summary,
    amount: tx.amount,
    createdAt: tx.createdAt,
    beneficiaryName: tx.beneficiaryName,
    transferType: tx.transferType,
  };
}

export function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const [txs, setTxs] = useState<TransactionViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const storedUser = api.getStoredUser<{ balance: number }>();
    setBalance(storedUser?.balance ?? 0);

    (async () => {
      try {
        setErr(null);
        setLoading(true);

        const apiTx: TransactionResponse[] = await api.listTx();
        if (!alive) return;

        console.log(apiTx);

        const ui = apiTx
          .slice()
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map(mapTxToUI)
          .slice(0, 5);

        setTxs(ui);
      } catch (e: unknown) {
        if (!alive) return;
        if (e instanceof Error) {
          setErr(e.message);
        } else {
          setErr("Erro ao carregar dados");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="bg-gradient-to-r from-red-magnum to-red-magnum/80 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Saldo Atual</h2>
            <button
              onClick={() => setShowBalance((v) => !v)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-3xl font-bold mb-2">
            {loading
              ? "Carregando…"
              : err
              ? "—"
              : showBalance
              ? balance !== null
                ? formatBRL(balance)
                : "R$ 0,00"
              : "R$ ••••••"}
          </div>
          <p className="text-white/80 text-sm">Conta Corrente • **** 2318</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <CardActions
            label="Realize aqui suas transações"
            icon={<ArrowUpRight className="w-6 h-6 text-red-magnum" />}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Últimas Transações</h2>
            <Link
              to="/history"
              className="text-red-magnum hover:text-red-magnum/80 text-sm font-medium transition-colors cursor-pointer"
            >
              Ver todas (Histórico)
            </Link>
          </div>

          {loading && <p className="text-gray-500">Carregando…</p>}
          {err && !loading && <p className="text-red-600">{err}</p>}

          {!loading && !err && (
            <div className="space-y-4">
              {txs.length === 0 && <p className="text-gray-500">Sem transações recentes.</p>}

              {txs.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cardInformation.map((info, index) => (
            <CardInformation key={index} cardInformation={info} />
          ))}
        </div>
      </div>
    </div>
  );
}
