import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import type { TransactionResponse } from "../services/api/dtos/transactionResponseDTO";

const LS_KEY = "__bank_mock_db_v1";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  balance: number;
  createdAt: string;
}

type DB = { users: User[]; transactions: TransactionResponse[] };

const seed: DB = {
  users: [
    {
      id: "u_demo",
      email: "demo@bank.com",
      name: "Usuário Demo",
      // hash de "123456"
      passwordHash: bcrypt.hashSync("123456", 10),
      balance: 200000,
      createdAt: new Date().toISOString(),
    },
  ],
  transactions: [],
};

function load(): DB {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}
function save(db: DB) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

let db = load();

export const DB = {
  snapshot(): DB {
    return db;
  },
  reset() {
    db = structuredClone(seed);
    save(db);
  },

  findUserByEmail(email: string) {
    return db.users.find((u) => u.email === email);
  },
  findUserById(id: string) {
    return db.users.find((u) => u.id === id);
  },

  async addUser(data: { email: string; name: string; password: string }) {
    const user: User = {
      id: uuid(),
      email: data.email,
      name: data.name,
      passwordHash: await bcrypt.hash(data.password, 10),
      balance: 200000,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    save(db);
    return user;
  },

  async checkPassword(user: User, password: string) {
    return bcrypt.compare(password, user.passwordHash);
  },

  updateUser(u: User) {
    const i = db.users.findIndex((x) => x.id === u.id);
    if (i >= 0) {
      db.users[i] = u;
      save(db);
    }
  },

  listTxByUser(userId: string) {
    return db.transactions
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  addTx(
    input: Omit<TransactionResponse, "id" | "createdAt" | "status"> & {
      status?: TransactionResponse["status"];
    }
  ) {
    const tx: TransactionResponse = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      status: input.status ?? "processing",
      ...input,
    };
    db.transactions.push(tx);
    save(db);
    return tx;
  },

  getTx(id: string) {
    return db.transactions.find((t) => t.id === id);
  },
  updateTx(t: TransactionResponse) {
    const i = db.transactions.findIndex((x) => x.id === t.id);
    if (i >= 0) {
      db.transactions[i] = t;
      save(db);
    }
  },
};
