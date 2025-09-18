# The Blog - Next.js React Blog

Um blog moderno e responsivo construído com Next.js 15, React 19 e TypeScript, seguindo princípios de Clean Architecture e utilizando Tailwind CSS para estilização.

## 🚀 Tecnologias Utilizadas

### Frontend

- **Next.js 15.5.0** - Framework React com App Router
- **React 19.1.0** - Biblioteca para interface de usuário
- **TypeScript 5** - Tipagem estática para JavaScript
- **Tailwind CSS 4** - Framework CSS utilitário
- **Turbopack** - Bundler rápido para desenvolvimento

### Bibliotecas e Utilitários

- **clsx** - Utilitário para construção de classes CSS condicionais
- **date-fns** - Biblioteca moderna para manipulação de datas
- **ESLint** - Linter para qualidade de código

## 📁 Estrutura do Projeto

O projeto segue uma arquitetura limpa e organizada:

```
src/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout principal da aplicação
│   ├── page.tsx           # Página inicial
│   ├── globals.css        # Estilos globais
│   └── post/[slug]/       # Páginas dinâmicas de posts
├── components/            # Componentes reutilizáveis
│   ├── Container/         # Container principal
│   ├── Header/           # Cabeçalho
│   ├── Footer/           # Rodapé
│   ├── PostCoverImage/   # Imagem de capa dos posts
│   ├── PostDate/         # Data dos posts
│   ├── PostFeatured/     # Post em destaque
│   ├── PostHeading/      # Títulos dos posts
│   ├── PostsList/        # Lista de posts
│   ├── PostSummary/      # Resumo dos posts
│   ├── SinglePost/       # Post individual
│   └── SpinLoader/       # Componente de loading
├── db/                   # Dados e seeds
│   └── seed/
│       └── posts.json     # Dados dos posts
├── lib/                  # Lógica de negócio
│   └── post/
│       └── queries.ts    # Consultas de posts
├── models/               # Modelos de dados
│   └── post/
│       └── post-model.ts # Modelo do post
├── repositories/         # Camada de repositório
│   └── post/
│       ├── index.tsx
│       ├── json-post-repository.ts
│       └── post-repository.ts
└── utils/               # Utilitários
    └── format-datetime.ts
```

## 🏗️ Arquitetura

O projeto implementa uma arquitetura limpa com as seguintes camadas:

### 1. **Presentation Layer** (`components/`)

- Componentes React reutilizáveis
- Interface do usuário
- Componentes específicos para posts

### 2. **Application Layer** (`lib/`)

- Lógica de negócio
- Consultas e operações
- Casos de uso da aplicação

### 3. **Domain Layer** (`models/`)

- Modelos de dados
- Entidades do domínio
- Tipos TypeScript

### 4. **Infrastructure Layer** (`repositories/`)

- Implementação de repositórios
- Acesso a dados
- Persistência (JSON para este projeto)

## 🎨 Funcionalidades

### ✅ Implementadas

- **Página inicial** com post em destaque e lista de posts
- **Páginas dinâmicas** para posts individuais (`/post/[slug]`)
- **Design responsivo** com Tailwind CSS
- **Loading states** com Suspense
- **SEO otimizado** com metadados
- **Arquitetura limpa** e escalável
- **TypeScript** para tipagem segura

### 📝 Modelo de Post

```typescript
type PostModel = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
};
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd blog

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento com Turbopack
npm run build    # Build de produção com Turbopack
npm run start    # Servidor de produção
npm run lint     # Verificação de código com ESLint
```

## 🌐 Acesso

Após executar `npm run dev`, acesse:

- **Local**: http://localhost:3000
- **Página inicial**: Lista de posts com destaque
- **Post individual**: `/post/[slug]`

## 📱 Design Responsivo

O blog é totalmente responsivo com:

- **Mobile First**: Design otimizado para dispositivos móveis
- **Grid Layout**: Sistema de grid responsivo do Tailwind
- **Breakpoints**: sm, md, lg para diferentes tamanhos de tela
- **Imagens otimizadas**: Next.js Image component com lazy loading

## 🔧 Configuração

### TypeScript

- Configuração estrita habilitada
- Path mapping configurado (`@/*` → `./src/*`)
- Suporte completo ao Next.js

### Tailwind CSS

- Configuração v4 com PostCSS
- Variáveis CSS customizadas
- Design system consistente

### ESLint

- Configuração Next.js
- Regras de qualidade de código
- Integração com TypeScript

## 📊 Dados

Os posts são armazenados em `src/db/seed/posts.json` com:

- Posts em português
- Dados completos (título, conteúdo, autor, datas)
- Imagens de capa
- Status de publicação

## 🎯 Próximos Passos

### Funcionalidades Futuras

- [ ] Sistema de autenticação
- [ ] Painel administrativo
- [ ] Editor de posts
- [ ] Sistema de comentários
- [ ] Busca de posts
- [ ] Tags e categorias
- [ ] Integração com CMS
- [ ] Deploy automatizado

### Melhorias Técnicas

- [ ] Testes unitários e de integração
- [ ] Storybook para componentes
- [ ] PWA (Progressive Web App)
- [ ] Otimizações de performance
- [ ] Analytics e métricas

## 📄 Licença

Este projeto é privado e desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ usando Next.js, React e TypeScript**
