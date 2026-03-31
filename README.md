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
- sanitização básica contra XSS

## Stack

- `React`
- `Vite`
- `Tailwind CSS`
- `Storybook`
- `Vitest`
- `DOMPurify`

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
  app/                 # composição da aplicação e fluxo principal
  domain/entities/     # modelagem e helpers das entidades
  infrastructure/api/  # integração com API e sanitização
  stories/             # documentação visual no Storybook
  tests/               # testes unitários
  ui/components/       # componentes reutilizáveis
```

## API

Base URL:

```bash
http://ec2-50-19-36-138.compute-1.amazonaws.com/api
```

Swagger:

```bash
http://ec2-50-19-36-138.compute-1.amazonaws.com/api-docs/index.html
```

O projeto usa autenticação Basic Auth para consumir a API.

## Segurança

Foram aplicadas duas proteções básicas:

- sanitização de entradas com `DOMPurify`
- `Content-Security-Policy` básica no `index.html`

Observação:
como a aplicação consome a API diretamente no frontend, as credenciais ficam expostas no ambiente cliente. Para produção, o ideal seria mover isso para um backend intermediário.

## Validações de Formulário

Os campos obrigatórios com `*` possuem validação customizada:

- textos obrigatórios: mínimo de `3` caracteres
- descrições obrigatórias: mínimo de `10` caracteres
- selects obrigatórios: não podem ficar vazios
- campos inválidos recebem borda vermelha e mensagem abaixo do input

## Testes

Foi criada uma suíte de testes unitários simples e adequada para demonstrar fundamentos de qualidade de código:

- validação do formulário
- helpers de transformação de dados
- sanitização contra XSS

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

Você pode criar um arquivo `.env.local` para sobrescrever a configuração padrão:

```bash
VITE_API_BASE_URL=http://ec2-50-19-36-138.compute-1.amazonaws.com/api
VITE_API_USERNAME=goledger
VITE_API_PASSWORD=5NxVCAjC
```

## Destaques Técnicos

- layout customizado com paleta definida no desafio
- sidebar com navegação por contexto
- cor dinâmica da área ativa conforme a entidade selecionada
- feedback visual para operações de CRUD
- formulário com validação própria e UX mais guiada
- Storybook para apresentar os componentes isoladamente

## Qualidade do Projeto

- build da aplicação validado com `npm run build`
- Storybook validado com `npm run build-storybook`
- testes unitários cobrindo validação, sanitização e helpers de domínio
- estrutura organizada para manutenção e evolução

## Status do Projeto

Estado atual:

- aplicação buildando com sucesso
- Storybook buildando com sucesso
- testes unitários passando

## Próximos Passos

- mover credenciais da API para um backend intermediário
- ampliar cobertura de testes para componentes e fluxos de integração
- adicionar paginação e filtros mais avançados na busca
- refinar responsividade para cenários de tela menor

