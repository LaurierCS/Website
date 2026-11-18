<div align="center">

  ```
 __                                  __                    ______   ______
|  \                                |  \                  /      \ /      \
| ▓▓       ______  __    __  ______  \▓▓ ______   ______ |  ▓▓▓▓▓▓\  ▓▓▓▓▓▓\
| ▓▓      |      \|  \  |  \/      \|  \/      \ /      \| ▓▓   \▓▓ ▓▓___\▓▓
| ▓▓       \▓▓▓▓▓▓\ ▓▓  | ▓▓  ▓▓▓▓▓▓\ ▓▓  ▓▓▓▓▓▓\  ▓▓▓▓▓▓\ ▓▓      \▓▓    \
| ▓▓      /      ▓▓ ▓▓  | ▓▓ ▓▓   \▓▓ ▓▓ ▓▓    ▓▓ ▓▓   \▓▓ ▓▓   __ _\▓▓▓▓▓▓\
| ▓▓_____|  ▓▓▓▓▓▓▓ ▓▓__/ ▓▓ ▓▓     | ▓▓ ▓▓▓▓▓▓▓▓ ▓▓     | ▓▓__/  \  \__| ▓▓
| ▓▓     \\▓▓    ▓▓\▓▓    ▓▓ ▓▓     | ▓▓\▓▓     \ ▓▓      \▓▓    ▓▓\▓▓    ▓▓
 \▓▓▓▓▓▓▓▓ \▓▓▓▓▓▓▓ \▓▓▓▓▓▓ \▓▓      \▓▓ \▓▓▓▓▓▓▓\▓▓       \▓▓▓▓▓▓  \▓▓▓▓▓▓



2026 / 2027

  ```

![GitHub](https://img.shields.io/github/license/LaurierCS/Website?style=flat-square)

</div>

## Overview

The official Laurier Computing Society website and admin app, made with :heart:

## Development

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

This repository contains two independently deployable apps:

- `apps/site/` — Public Astro website
- `apps/admin/` — Vite and React admin dashboard

Every change starts as a GitHub issue and goes in through a small PR using the [PR template](.github/pull_request_template.md). Frontend PRs need screenshots; backend/admin and docs PRs do not.

### Requirements

- Node.js 22+
- pnpm 9+

### Setup

Clone the repository:

```sh
git clone https://github.com/LaurierCS/Website
cd Website
```

Set up the public site:

```sh
cd apps/site
pnpm install
cp .env.example .env
pnpm dev
```

Set up the admin dashboard:

```sh
cd apps/admin
pnpm install
cp .env.example .env
pnpm dev
```

Ask a VP of Engineering for the Supabase values. Never commit `.env` files or a Supabase service role key.

### Commands

Run these from `apps/site/`:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Astro dev server |
| `pnpm build` | Create a production build |
| `pnpm preview` | Preview the production build |
| `pnpm check` | Run Astro and TypeScript checks |

Run these from `apps/admin/`:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type check and create a production build |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Run the oxlint linter |
