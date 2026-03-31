# GoLedger Challenge Web

Uma interface web para catálogo de séries, temporadas, episódios e watchlists, integrada à API da GoLedger.

![React](https://img.shields.io/badge/React-18-20232A?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![Storybook](https://img.shields.io/badge/Storybook-8-FF4785?logo=storybook)
![Vitest](https://img.shields.io/badge/Vitest-2-6E9F18?logo=vitest)
![Status](https://img.shields.io/badge/status-ready%20to%20demo-40f99b)

## Visão Geral

O objetivo deste projeto é entregar uma aplicação React ou Next.js com operações completas de:

- criação
- edição
- exclusão
- busca

O sistema funciona como um catálogo no estilo IMDb, mas com identidade visual própria, interface em português, feedback visual para o usuário e integração com uma API blockchain-backed.
Optei por React, pois em um cenário real Next elevaria o custo e não sei se temos budget pra isso.

## Preview

Principais pontos da aplicação:

- navegação lateral por tipo de entidade
- painel de busca e listagem
- formulário de criação e edição
- feedback com toasts
- validação visual de campos obrigatórios
- cache e mutações com React Query
- documentação de componentes no Storybook

## Funcionalidades

- CRUD de `Séries`
- CRUD de `Temporadas`
- CRUD de `Episódios`
- CRUD de `Watchlists`
- busca local por entidade ativa
- feedback com toasts de sucesso, erro e exclusão
- validação visual de formulário
- Storybook para documentação dos componentes
- modal de confirmação customizado para exclusão

## Stack

- `React`
- `TypeScript`
- `Vite`
- `@tanstack/react-query`
- `Zod`
- `Tailwind CSS`
- `Storybook`
- `Vitest`

## Scripts

| Comando | Descrição |
|---|---|
| `npm install` | instala as dependências |
| `npm run dev` | inicia o ambiente local |
| `npm run build` | gera o build de produção |
| `npm test` | executa os testes unitários |
| `npm run storybook` | inicia o Storybook |
| `npm run build-storybook` | gera o build estático do Storybook |

## Arquitetura

O projeto foi organizado por responsabilidade:

```text
src/
  app/                 # composição da aplicação, hooks e providers
  domain/entities/     # modelagem e helpers das entidades
  infrastructure/api/  # integração com API
  stories/             # documentação visual no Storybook
  tests/               # testes unitários
  ui/components/       # componentes reutilizáveis
```

## API

O projeto usa autenticação Basic Auth para consumir a API.

## Segurança

Foram aplicadas duas proteções básicas:

- `Content-Security-Policy` básica no `index.html`
- escape padrão do React para renderização de conteúdo textual

Observação:
como a aplicação consome a API diretamente no frontend, as credenciais continuam visíveis no ambiente cliente em tempo de execução. Para produção, o ideal continua sendo mover essa autenticação para um backend intermediário.

## Validações de Formulário

Os campos obrigatórios com `*` são validados com `Zod`:

- textos obrigatórios: mínimo de `3` caracteres
- descrições obrigatórias: mínimo de `10` caracteres
- selects obrigatórios: não podem ficar vazios
- campos inválidos recebem borda vermelha e mensagem abaixo do input

## Testes

Foi criada uma suíte de testes unitários simples e adequada para demonstrar fundamentos de qualidade de código:

- validação de formulário com `Zod`
- helpers de transformação de dados

Executando os testes:

```bash
npm test
```

### Fluxo rápido

```bash
npm install
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` com as credenciais recebidas separadamente:

```bash
VITE_API_BASE_URL=your_api_base_url
VITE_API_USERNAME=your_api_username
VITE_API_PASSWORD=your_api_password
```

O repositório inclui apenas placeholders em `.env.example`.
As credenciais reais devem ser mantidas fora do versionamento e podem ser compartilhadas em um arquivo separado, como `api-credentials.txt`.

## Destaques Técnicos

- layout customizado com paleta definida no desafio
- sidebar com navegação por contexto
- cor dinâmica da área ativa conforme a entidade selecionada
- feedback visual para operações de CRUD
- formulário desacoplado em hooks com validação tipada
- sincronização de dados com `React Query`
- Storybook para apresentar os componentes isoladamente

## Qualidade do Projeto

- build da aplicação validado com `npm run build`
- Storybook validado com `npm run build-storybook`
- testes unitários cobrindo validação e helpers de domínio
- estrutura organizada para manutenção e evolução

## Status do Projeto

Estado atual:

- aplicação buildando com sucesso
- Storybook buildando com sucesso
- testes unitários passando
