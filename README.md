<div align='center'>

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

## Overview :sparkles:
- The official Laurier Computing Society website, made with :heart:

## Development :computer:
![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/Typescript-323330?style=for-the-badge&logo=typescript&logoColor=3178C6)
![](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Every change starts as a GitHub issue and goes in through a small PR using the [PR template](/.github/pull_request_template.md). Frontend PRs need screenshots; admin/backend PRs don't.

### Requirements
- Node.js, PNPM

### Setup
> Clone repo
```sh
$ git clone https://github.com/LaurierCS/Website
```
> Install dependencies
```sh
$ pnpm i
```
> Set up environment variables (ask a VP of Engineering for the Supabase values)
```sh
$ cp .env.example .env
```
> Launch local server
```sh
$ pnpm dev
```

### Scripts
| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the local dev server |
| `pnpm build` | Type check and build to `dist/` |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview the production build |

### Project structure
- `src/pages/` page sections and routes (`/`, `/hack-to-the-future`)
- `src/components/` UI components grouped by section
- `src/services/supabase.ts` Supabase client (events and team data come from Supabase)
- `public/` static assets, favicons, `robots.txt`, `sitemap.xml`
