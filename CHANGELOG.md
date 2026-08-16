# Changelog

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
