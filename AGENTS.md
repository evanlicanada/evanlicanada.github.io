# Antigravity Agent Instructions for Portfolio Website

This file (AGENTS.md) is automatically loaded by Antigravity bots at the start of a conversation. It contains all the necessary context, architectural decisions, and rules to successfully develop and maintain this portfolio website.

## 🔴 META-RULE: ALWAYS KEEP THIS FILE UPDATED
If the user gives you a new core instruction on how they want you to behave, a new architectural rule, or a new preference for how to develop the site, **you MUST update this AGENTS.md file** to include it. This ensures future bots always have the latest context and know exactly how to behave.

## Project Architecture & Tech Stack
- **Framework**: Astro 5 (using the new Content Layer API).
- **UI & Styling**: React 19, Tailwind CSS v4, and @tailwindcss/typography (for markdown prose).
- **3D Graphics**: Vanilla 	hree.js inside a React component (StarMapCanvas.tsx).
- **Data Management**: Markdown files in src/content/projects/. 

## Core Development Rules

### 1. Astro 5 Content Collections & Markdown
- **Schemas**: Project schemas are defined in src/content.config.ts using Zod. Each project must have valid coord arrays for the 3D Star Map mapping.
- **Syncing**: If you modify content.config.ts or add new collections, you MUST run 
px astro sync to regenerate the types, otherwise the dev server/build will fail or return empty collections.
- **Markdown Rendering**: Detailed project views are rendered in src/pages/projects/[...slug].astro. They use Tailwind's typography plugin classes (prose prose-invert prose-nasa).

### 2. Static Assets (Images & Videos)
- **CRITICAL**: All images and videos referenced in Markdown files or project cards MUST be placed in the public/ directory (e.g., public/project_images/..., public/project_cover_imgs/...).
- When writing Markdown image/video tags or project frontmatter `coverImage`, use absolute root paths (e.g., `coverImage: "/project_cover_imgs/my_cover.jpg"` or `/project_images/autonomous-robot/image.jpg`). 
- Do **not** place referenced Markdown media or card covers in `src/`. They will not route correctly.
- You may use standard HTML `<video>` tags inside Markdown for video playback.

### 3. Tailwind CSS v4
- Tailwind v4 does not use a traditional 	ailwind.config.js. All theme variables and plugins are configured directly via CSS in src/styles/global.css (e.g., @theme { ... }).
- The typography plugin is imported via @plugin "@tailwindcss/typography"; in global.css.

### 4. PowerShell & File Encoding Quirks
- The user is on a Windows machine using PowerShell.
- **WARNING**: Do NOT use echo "content" >> file in PowerShell to append text. It defaults to UTF-16 (UCS-2) encoding, which will inject null bytes and corrupt CSS/JS parsers (like Tailwind's parser).
- Use Add-Content -Path "..." -Value "..." -Encoding UTF8 or Python scripts if you need to append or generate files.

### 5. LaTeX & Mathematical Notation (KaTeX)
- LaTeX math formulas ($inline$ and $$display$$) are supported in Markdown using `remark-math`, `rehype-katex`, and `@astrojs/markdown-remark`.
- KaTeX styles are imported via `import 'katex/dist/katex.min.css'` in `Layout.astro` and backed up by the KaTeX CDN stylesheet.
- You can freely use standard LaTeX math syntax in project Markdown files (e.g. `$256 \to 64$`, `$T_{cam2gripper} = T_{rot}(\varphi_4) \cdot T_{hand-eye}$`, etc.).

## Dev Server Commands

When starting the dev server, use background mode:
\\\ash
# If astro is not in path natively, use npx:
npx astro dev --background
\\\

Manage the background server with \
px astro dev stop\, \
px astro dev status\, and \
px astro dev logs\.

## Official Documentation

Full Astro documentation: https://docs.astro.build
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind styling](https://docs.astro.build/en/guides/styling/)
