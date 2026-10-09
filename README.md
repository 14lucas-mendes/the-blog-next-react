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

Os testes usam o runner do Node e um carregador TypeScript para executar os mesmos módulos usados pela aplicação. Os testes injetam repositórios isolados, sem alterar o singleton da aplicação nem criar o banco padrão. O CI executa lint, TypeScript, testes, migrations, seed, build e verificações HTTP de home, artigo, 404, rascunhos, paginação, SEO e otimização de imagem. O smoke usa um backup temporário do banco para verificar também uma home vazia com HTTP 200 e falhas de banco com HTTP 500, sem modificar o arquivo original. Os status são verificados para navegadores e bots.

## Estrutura

- `src/app`: página inicial paginada, artigos por slug, erros, sitemap e robots.
- `src/components`: cards, destaque, artigo, Markdown e componentes de apresentação.
- `src/lib/post`: consultas com deduplicação por requisição via `React.cache`.
- `src/repositories/post`: contrato e implementações SQLite/Drizzle e JSON.
- `src/db/drizzle`: conexão, schema, migrations e seed.
- `src/db/seed/posts.json`: conteúdo de exemplo, importado pelo seed.
- `tests`: regressões e integração.

A página inicial mostra até dez publicações por página e um destaque na primeira. As consultas dos cards omitem o corpo do artigo. As rotas públicas filtram rascunhos; consultas por ID na camada de repositório podem retornar rascunhos e não devem ser expostas sem autorização em um futuro painel administrativo.

Posts ausentes, rascunhos e páginas de paginação sem resultados respondem HTTP 404 para navegadores e bots. As consultas terminam antes de iniciar a resposta das páginas. Falhas de banco são propagadas à tela de erro, que oferece uma tentativa de recuperação. A primeira página de um banco sem publicações continua respondendo HTTP 200 com uma mensagem de estado vazio.

## Banco existente e migrations

Faça backup do banco antes de aplicar migrations em produção. A migration `0001_add_post_content` adiciona uma coluna `content` independente de `created_at`, sem apagar os posts ou modificar suas datas, e cria um índice para as listagens públicas.

Ao atualizar uma instalação da versão anterior:

1. Pare a aplicação e faça backup do SQLite antes de atualizar o checkout. O antigo `db.sqlite3` versionado foi removido; preserve o banco usado pela instalação fora do repositório antes de executar `git pull`.
2. Configure `DATABASE_PATH` para esse arquivo persistente, tanto nos comandos de migration quanto no processo da aplicação.
3. Atualize o código, execute `npm ci` e aplique `npm run db:migrate` com esse caminho. Uma instalação nova também precisa das migrations: criar um arquivo SQLite não cria o schema automaticamente.
4. Execute o seed apenas se desejar os posts de exemplo. Ele não restaura conteúdo perdido nem sobrescreve posts existentes.
5. Configure `SITE_URL`, execute o build e reinicie a aplicação. Verifique a home, um artigo publicado e a resposta 404 de um slug ausente.

A versão anterior associava conteúdo e data à mesma coluna. Texto que nunca foi armazenado não pode ser recuperado por uma migration: posts existentes recebem conteúdo vazio e precisam ser restaurados da fonte original. O seed não sobrescreve registros existentes.

## SEO e publicação

Configure `SITE_URL` com a URL pública real **antes do build de produção** e mantenha o mesmo valor ao executar o servidor. Em produção, sua ausência interrompe o build com uma mensagem explícita. Se a variável faltar apenas na execução, `next start` pode anunciar que está pronto, mas as páginas e o sitemap falham com HTTP 500 ao carregar seus módulos na primeira requisição. O `/robots.txt` é gerado no build e mantém a URL usada naquela etapa. Verifique a resposta da home para confirmar que a aplicação está saudável. O padrão `http://localhost:3000` é usado em desenvolvimento. A URL deve usar HTTP ou HTTPS. Essa configuração alimenta canonical, Open Graph, Twitter cards, `/sitemap.xml` e `/robots.txt`.

`DATABASE_PATH` deve apontar para um arquivo em armazenamento persistente, acessível ao processo Node. Para servidores com várias réplicas ou ambientes com sistema de arquivos efêmero, planeje um banco compartilhado antes de publicar. A aplicação usa o runtime Node; o driver SQLite nativo não funciona no Edge Runtime.

```bash
export SITE_URL=https://seu-blog.example
export DATABASE_PATH=/caminho/persistente/blog.sqlite3
npm run db:migrate
npm run db:seed # opcional em produção
npm run build
npm start
```

A leitura dos posts ocorre a cada requisição, para refletir alterações no SQLite sem depender de um novo build.

## Interface e segurança

- Idioma `pt-BR`, região principal de conteúdo e link para pular o cabeçalho.
- Markdown com `remark-gfm` e `rehype-sanitize`, incluindo tabelas com rolagem horizontal.
- Estilos de leitura no modo escuro e imagens com tamanhos responsivos.
- Next.js e React em versões com correções de segurança; mantenha o lockfile e as dependências atualizados.
- Overrides de PostCSS e Sharp atualizam dependências transitivas ainda fixadas em versões antigas pelo Next.js 15. O smoke de produção verifica a otimização de imagens com essas versões.

