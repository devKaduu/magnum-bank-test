# Magnum Bank - Teste Front-end React

Aplicação desenvolvida para o teste de **Desenvolvedor Front-end React** do Magnum Bank.

---

## 🚀 Tecnologias

- React + Vite
- TypeScript
- TailwindCSS
- React Router DOM
- Context API
- wsc (mock da API, no lugar do JSON Server)
- JWT simulado

---

## ⚙️ Funcionalidades

- Autenticação (login, registro, logout)
- Exibição de saldo e últimas transações
- Realizar transações (TED/PIX)
- **Senha de transação cadastrada na primeira transação**
- Histórico com filtros (tipo, período, data, valor) e ordenação

---

## ⚙️ Testes

- Não consegui adicionar os testes por conta do prazo.

## Fluxo de autenticação

- /register → cria usuário (name, email, password, transactionPassword)

- /login → retorna accessToken (JWT) + dados do usuário

- Token é salvo no localStorage e enviado em todos os requests seguintes (Authorization: Bearer).

## ▶️ Rodar o projeto

```bash
git clone https://github.com/devKaduu/magnum-bank-test.git
cd magnum-bank
npm install
npm run dev
```
