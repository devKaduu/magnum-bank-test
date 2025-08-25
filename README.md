# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## 2.6 Integração com API

- Criar uma API mock usando JSON Server para simular interações de back-end.

Este repositório já inclui um servidor mock usando `json-server` e `json-server-auth`.

Arquivos importantes:

- `db.json` — banco de dados JSON com as coleções: `users`, `balances`, `transactions`.
- `server.js` — servidor que expõe a API mock em `/api` e habilita autenticação básica via `json-server-auth`.

Como rodar:

1. Instale dependências (se ainda não instalou):

```bash
npm install
```

2. Inicie o servidor mock (usa a porta 3333 por padrão):

```bash
npm run api
```

3. Endpoints úteis (padrões):

- POST /api/register — registra um novo usuário (campos: `email`, `password`, outros campos opcionais)
- POST /api/login — realiza login e retorna token JWT
- GET /api/users — lista usuários (protegido)
- GET /api/transactions — lista transações
- GET /api/balances — lista saldos

Exemplo de uso (cURL):

Registrar usuário:

```bash
curl -X POST http://localhost:3333/api/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}'
```

Login:

```bash
curl -X POST http://localhost:3333/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}'
```

Obter transações públicas:

```bash
curl http://localhost:3333/api/transactions
```

Notas:

- O `server.js` usa `json-server-auth` para endpoints de registro/login simples e proteção de rotas.
- Os dados persistem em `db.json` enquanto o servidor estiver apontando para esse arquivo.
- Se precisar de regras de rota personalizadas, adicione um arquivo `routes.json` e ajuste o `server.js`.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
