# Agent Playbook

This repository is optimised for collaboration with human developers and code-generating agents. Follow the checklist below to keep contributions consistent and automation-friendly.

## 1. Discoverability
- Read `docs/index.d.ts` first. It lists every exported symbol with use cases, performance notes, and import paths.
- Use `src/index.ts` for ESM imports. Category folders mirror the sections in the type definitions (`procedural`, `spatial`, `ai`, etc.).
- Examples in `examples/` show runnable TypeScript snippets for quick verification.

## 2. Contribution Workflow
1. Create a feature branch (`feature/<topic>`).
2. For each feature/fix:
   - Implement runtime code in `src/<category>/`.
   - Update `docs/index.d.ts` with the same structure (description, “Use for”, performance, import path).
   - Add or update tests in `tests/` (Vitest) and, when applicable, a runnable example in `examples/`.
   - Update documentation touchpoints (`README.md`, `PROJECT_DESCRIPTION.md`, `ROADMAP.md`) if scope or roadmap changes.
3. Run the full quality gate before committing:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
4. Commit changes atomically with descriptive messages (e.g., `feat: add behaviour tree module`).
5. Open a pull request targeting `main`.

## 3. Coding Guidelines
- Use modern TypeScript, strict typing, and keep functions pure when possible.
- Provide rich JSDoc (description, “Useful for” line, typed params/returns, runnable `@example`s).
- Default to ASCII and keep comments concise.
- Prefer options objects for functions with more than three parameters.
- Handle edge cases gracefully; expose internal helpers through `__internals` only when needed for testing.

## 4. Testing Philosophy
- Every new algorithm must ship with unit coverage exercising typical and edge scenarios.
- When randomness is involved, use deterministic seeding to keep tests reproducible.
- Example snippets should run without external dependencies (Node 18+).

## 5. LLM-Friendly Design
- Maintain consistent naming and file structure so LLMs can map `docs/index.d.ts` descriptions to actual implementations.
- Provide narrative comments only for non-obvious logic; avoid redundant remarks.
- Keep exports centralised in `src/index.ts` to simplify import instructions in prompts.

Following this playbook keeps the codebase predictable for both humans and automated agents.
