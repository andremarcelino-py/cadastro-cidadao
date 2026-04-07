# Cadastro Cidadão

Uma aplicação React para cadastro de cidadãos.

## Como executar localmente

1. Instale as dependências:
   ```
   npm install
   ```

2. Execute o projeto:
   ```
   npm start
   ```

## Login e perfis

- A aplicação agora inicia em `login`.
- Login é feito apenas por token (sem e-mail).
- Token do admin: `Leo.22`
- O admin cria líderes pelo painel com `nome + token`.
- O líder entra usando somente o token.
- Se existir a tabela `lider_tokens` no Supabase, os tokens ficam no banco.
- Se a tabela não existir, o sistema salva localmente no navegador (fallback).

### Exemplo de `.env`

```
REACT_APP_SUPABASE_URL=Sua URL do Supabase
REACT_APP_SUPABASE_ANON_KEY=Sua chave publishable/anon do Supabase
# Compatibilidade (opcional)
VITE_SUPABASE_URL=Sua URL do Supabase
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=Sua chave publishable do Supabase
```

### SQL opcional no Supabase (lideres por token)

```sql
create table if not exists public.lider_tokens (
  id bigint generated always as identity primary key,
  nome text not null,
  token text not null unique,
  created_at timestamp with time zone default now()
);
```

## Deploy no Netlify via GitHub

1. Instale o Git se não tiver: https://git-scm.com/downloads

2. Crie um repositório no GitHub.

3. Inicialize o Git no projeto:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USERNAME/SEU_REPO.git
   git push -u origin main
   ```

4. Vá para [Netlify](https://netlify.com), faça login ou cadastre-se.

5. Clique em "New site from Git".

6. Conecte sua conta do GitHub.

7. Selecione o repositório criado.

8. Nas configurações:
   - Build command: `npm run build`
   - Publish directory: `build`

9. Adicione as variáveis de ambiente em "Environment variables":
   - `REACT_APP_SUPABASE_URL`: Sua URL do Supabase
   - `REACT_APP_SUPABASE_ANON_KEY`: Sua chave publishable/anon do Supabase
   - (opcional) `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

10. Clique em "Deploy site".

O site será implantado automaticamente sempre que você fizer push para o branch main.