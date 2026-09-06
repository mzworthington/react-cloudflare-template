# Changelog

## 2026-09-06

### 🧰 Maintenance & Dependencies

- *(deps)* Bump @pulumi/pulumi in /infra/cloudflare (#26)
- *(deps-dev)* Bump @types/node in /infra/cloudflare (#25)
- *(deps-dev)* Bump @types/react-dom from 19.2.4 to 19.2.5 in /app (#24)
- *(deps-dev)* Bump oxlint from 1.77.0 to 1.80.0 in /app (#23)
- *(deps-dev)* Bump vite from 8.2.1 to 8.2.2 in /app (#21)
- *(deps-dev)* Bump wrangler from 4.120.0 to 4.126.0 in /app (#15)
- *(deps)* Bump mermaid from 11.12.0 to 11.17.2 in /app (#20)
- *(deps)* Bump @pulumi/cloudflare in /infra/cloudflare (#17)
- *(deps-dev)* Bump vitest from 4.1.10 to 4.1.11 in /app (#9)
- *(deps-dev)* Bump knip from 6.32.0 to 6.34.0 in /app (#22)

## 2026-09-03

### 🚀 Features

- Integrate PostHog for analytics tracking and add privacy routing

### 🐛 Bug Fixes

- Skip core-js postinstall and format PostHog secrets docs

### 🧰 Maintenance & Dependencies

- Update documentation for Waykit integration and clarify setup instructions
- Update .gitignore and AGENTS.md for MCP configuration and workspace clarity
- Add pulumi to toolchain installation in mise.toml
- Update core-js setting in pnpm-workspace.yaml to false

## 2026-09-02

### 🧰 Maintenance & Dependencies

- Update references from agent-lifecycle-kit to Waykit in documentation and setup scripts

### 🎨 Styling

- Align Waykit table cells with Prettier

## 2026-09-01

### 🚀 Features

- *(cloudflare)* Add optional Web Analytics integration and CI injection

### ⚙️ Refactoring & Performance

- *(cloudflare)* Remove CI injection for Web Analytics and update documentation for zone ownership

### 🧰 Maintenance & Dependencies

- Dependabot pins

## 2026-08-10

### 🚀 Features

- Implement copyable snippets for create and hosting commands in HomePage
- Enhance documentation structure with ADR support and improve Markdown rendering
- Add Mermaid.js support for diagram rendering in documentation

### ⚙️ Refactoring & Performance

- Update project initialization and documentation for improved clarity and usability
- Streamline project initialization script and enhance README structure with placeholders

### 🧰 Maintenance & Dependencies

- Tighten quality gates
- *(deps-dev)* Bump @types/node in /infra/cloudflare
- *(deps-dev)* Bump typescript in /infra/cloudflare

### 📚 Documentation

- Note Dependabot skip for Pulumi secrets

## 2026-08-09

### 🚀 Features

- Add author credit link to DocsShell component

## 2026-08-08

### 🧰 Maintenance & Dependencies

- Refactor Cloudflare setup to use edge-dns for bootstrap and remove deprecated action
- Update .gitignore to include environment files and secrets

## 2026-08-07

### 🚀 Features

- Initial react-cloudflare-template
- Teamplte for typescript react apps, deployed to cloudflare
- Enhance Cloudflare setup and documentation
- Add hosting bootstrap snippet and enhance HomePage layout
- Enhance design system and branding features
- *(cloudflare)* Add Web Analytics and Observatory scheduled tests to infrastructure

### 🐛 Bug Fixes

- Include scripts and configs in knip entry points

### ⚙️ Refactoring & Performance

- Subdomain-only hosting and drop em dashes

### 🧰 Maintenance & Dependencies

- Format docs and mark setup-dev-env executable
- Update Pulumi actions in Cloudflare workflow to use custom action for preview and apply
