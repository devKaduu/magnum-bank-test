/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from "msw";
import type { TransactionInput } from "../api/api";
import type { TransactionResponse } from "../services/api/dtos/transactionResponseDTO";
import { DB } from "./db";
import { readBearer, signToken, verifyToken } from "./jwt";
import { formatBRL, validateTransaction } from "./validators";

const API = "/api";

function toSession(u: { id: string; email: string; name: string; balance: number }): any {
  return { id: u.id, email: u.email, name: u.name, balance: u.balance };
}

const num = (v: string | null) => {
  if (v === null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};
const isoOnly = (s: string) => s.slice(0, 10);

const txDate = (t: any) => new Date(t.transactionDate || isoOnly(t.createdAt));

export const handlers = [
  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as any;
    if (!body?.email || !body?.name || !body?.password) {
      return HttpResponse.json(
        { message: "Campos obrigatórios: email, name, password" },
        { status: 400 }
      );
    }
    if (DB.findUserByEmail(body.email)) {
      return HttpResponse.json({ message: "E-mail já registrado" }, { status: 409 });
    }
    const user = await DB.addUser(body);
    const token = await signToken({ userId: user.id }, "1d");
    return HttpResponse.json({ token, user: toSession(user) }, { status: 201 });
  }),

  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;
    if (!body?.email || !body?.password) {
      return HttpResponse.json(
        { message: "Campos obrigatórios: email, password" },
        { status: 400 }
      );
    }
    const user = DB.findUserByEmail(body.email);

    if (!user) return HttpResponse.json({ message: "Credenciais inválidas" }, { status: 401 });

    const ok = await DB.checkPassword(user, body.password);

    if (!ok) return HttpResponse.json({ message: "Credenciais inválidas" }, { status: 401 });

    const token = await signToken({ userId: user.id }, "1d");
    return HttpResponse.json({ token, user: toSession(user) });
  }),

  http.post(`${API}/transactions`, async ({ request }) => {
    const token = readBearer(request);

    const dec = await verifyToken<{ userId: string }>(token);

    if (!dec) return HttpResponse.json({ message: "Não autorizado" }, { status: 401 });

    const input = (await request.json()) as TransactionInput;

    const v = validateTransaction(input);

    if (v) return HttpResponse.json({ message: v }, { status: 400 });

    const user = DB.findUserById(dec.userId);

    if (!user) return HttpResponse.json({ message: "Usuário não encontrado" }, { status: 404 });

    if (user.balance < input.amount) {
      return HttpResponse.json({ message: "Saldo insuficiente" }, { status: 400 });
    }

    const summary =
      input.transferType === "pix"
        ? `PIX para ${input.beneficiaryName} (chave ${input.pixKey}) no valor de ${formatBRL(
            input.amount
          )}`
        : `TED para ${input.beneficiaryName} (${input.bank} Ag ${input.branch} Cc ${
            input.accountNumber
          }) no valor de ${formatBRL(input.amount)}`;

    user.balance -= input.amount;
    DB.updateUser(user);

    const tx = DB.addTx({
      userId: user.id,
      ...input,
      summary,
      status: "processing",
    });

    setTimeout(() => {
      const saved = DB.getTx(tx.id);
      if (saved && saved.status === "processing") {
        const updated: TransactionResponse = { ...saved, status: "completed" };
        DB.updateTx(updated);
      }
    }, 2000);

    return HttpResponse.json(tx, { status: 201 });
  }),

  http.get(`${API}/transactions`, async ({ request }) => {
    const token = readBearer(request);
    const dec = await verifyToken<{ userId: string }>(token);
    if (!dec) return HttpResponse.json({ message: "Não autorizado" }, { status: 401 });

    const url = new URL(request.url);
    const typeParam = url.searchParams.get("type");
    const sort = (url.searchParams.get("sort") || "desc") as "asc" | "desc";
    const presetDays = num(url.searchParams.get("presetDays"));
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const minAmount = num(url.searchParams.get("minAmount"));
    const maxAmount = num(url.searchParams.get("maxAmount"));

    let list = DB.listTxByUser(dec.userId);

    if (typeParam === "pix" || typeParam === "ted") {
      list = list.filter((t) => t.transferType === typeParam);
    }

    if (presetDays && [7, 15, 30, 90].includes(presetDays)) {
      const now = new Date();
      const from = new Date();
      from.setDate(now.getDate() - presetDays);
      list = list.filter((t) => {
        const d = txDate(t);
        return d >= from && d <= now;
      });
    }

    if (startDate) {
      const s = new Date(startDate);
      list = list.filter((t) => txDate(t) >= s);
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      list = list.filter((t) => txDate(t) <= e);
    }

    if (typeof minAmount === "number") list = list.filter((t) => t.amount >= minAmount);
    if (typeof maxAmount === "number") list = list.filter((t) => t.amount <= maxAmount);

    list = list.sort((a, b) => {
      const da = a.transactionDate || isoOnly(a.createdAt);
      const db = b.transactionDate || isoOnly(b.createdAt);
      return sort === "asc" ? da.localeCompare(db) : db.localeCompare(da);
    });

    return HttpResponse.json(list);
  }),
];
