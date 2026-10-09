# The Blog

Blog em português com Next.js 15, React 19, TypeScript, Tailwind CSS 4 e SQLite/Drizzle. A interface usa componentes de servidor, Markdown sanitizado e uma camada de repositórios para acesso aos posts.

## Executar localmente

Use Node.js 24 LTS, indicado em `.nvmrc`. Node 22 a partir de 22.15 também é compatível. A dependência nativa `better-sqlite3` pode exigir ferramentas de compilação quando não houver binário pronto para sua plataforma.

```bash
git clone https://github.com/14lucas-mendes/the-blog-next-react.git
cd the-blog-next-react
nvm use
npm ci
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

Acesse http://localhost:3000. O banco é criado localmente; arquivos SQLite não são versionados. O seed insere os dez posts de exemplo, incluindo rascunhos que não aparecem nas rotas públicas. Executá-lo novamente preserva os posts existentes e não cria duplicatas. Falhas resultam em código de saída diferente de zero.

Os comandos de banco usam `DATABASE_PATH` do ambiente do processo, com padrão `./db.sqlite3`; não carregam automaticamente `.env.local`. Para outro banco:

```bash
DATABASE_PATH=/caminho/existente/blog.sqlite3 npm run db:migrate
DATABASE_PATH=/caminho/existente/blog.sqlite3 npm run db:seed
```

Configure o mesmo caminho na aplicação Next.js. O diretório pai deve existir.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Desenvolvimento com Turbopack |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Testes de migrations, repositórios, seed e fluxos públicos |
| `npm run smoke` | Verificar o servidor de produção após build e seed |
| `npm run db:generate` | Gerar novas migrations após editar o schema |
| `npm run db:migrate` | Aplicar migrations pendentes |
| `npm run db:seed` | Inserir posts de exemplo sem sobrescrever registros |

Os testes usam o runner do Node e um carregador TypeScript para executar os mesmos módulos usados pela aplicação. Testes de repositório e seed usam bancos temporários. O CI executa lint, TypeScript, testes, migrations, seed, build e verificações HTTP de home, artigo, 404, rascunhos, SEO e otimização de imagem.

## Estrutura

- `src/app`: página inicial paginada, artigos por slug, erros, sitemap e robots.
- `src/components`: cards, destaque, artigo, Markdown e componentes de apresentação.
- `src/lib/post`: consultas com deduplicação por requisição via `React.cache`.
- `src/repositories/post`: contrato e implementações SQLite/Drizzle e JSON.
- `src/db/drizzle`: conexão, schema, migrations e seed.
- `src/db/seed/posts.json`: conteúdo de exemplo, importado pelo seed.
- `tests`: regressões e integração.

A página inicial mostra até dez publicações por página e um destaque na primeira. As consultas dos cards omitem o corpo do artigo. As rotas públicas filtram rascunhos; consultas por ID na camada de repositório podem retornar rascunhos e não devem ser expostas sem autorização em um futuro painel administrativo.

Um post ausente resulta em 404. Falhas de banco são propagadas à tela de erro, que oferece uma tentativa de recuperação. A página inicial suporta um banco sem publicações.

## Banco existente e migrations

Faça backup do banco antes de aplicar migrations em produção. A migration `0001_add_post_content` adiciona uma coluna `content` independente de `created_at`, sem apagar os posts ou modificar suas datas, e cria um índice para as listagens públicas.

A versão anterior associava conteúdo e data à mesma coluna. Texto que nunca foi armazenado não pode ser recuperado por uma migration: posts existentes recebem conteúdo vazio e precisam ser restaurados da fonte original. O seed não sobrescreve registros existentes.

## SEO e publicação

Configure `SITE_URL` com a URL pública real **antes do build de produção**. O padrão `http://localhost:3000` serve ao desenvolvimento. Essa configuração alimenta canonical, Open Graph, Twitter cards, `/sitemap.xml` e `/robots.txt`.

`DATABASE_PATH` deve apontar para um arquivo em armazenamento persistente, acessível ao processo Node. Para servidores com várias réplicas ou ambientes com sistema de arquivos efêmero, planeje um banco compartilhado antes de publicar. A aplicação usa o runtime Node; o driver SQLite nativo não funciona no Edge Runtime.

```bash
npm run db:migrate
npm run db:seed # opcional em produção
npm run build
npm start
```

A leitura dos posts ocorre a cada requisição, para refletir alterações no SQLite sem depender de um novo build.

## Interface e segurança

- Idioma `pt-BR`, região principal de conteúdo e link para pular o cabeçalho.
- Carregamento anunciado a leitores de tela e respeito à preferência por menos movimento.
- Markdown com `remark-gfm` e `rehype-sanitize`, incluindo tabelas com rolagem horizontal.
- Estilos de leitura no modo escuro e imagens com tamanhos responsivos.
- Next.js e React em versões com correções de segurança; mantenha o lockfile e as dependências atualizados.
- Overrides de PostCSS e Sharp atualizam dependências transitivas ainda fixadas em versões antigas pelo Next.js 15. O smoke de produção verifica a otimização de imagens com essas versões.

