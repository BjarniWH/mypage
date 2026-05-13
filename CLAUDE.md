# CLAUDE.md — Project AI Guidelines

> This file is read automatically by Claude Code. It defines coding standards, architecture
> conventions, and design principles for this project. Keep it up to date as the project evolves.

---

## 🤖 Official Angular Agent Skills

The Angular team maintains official agent skills at **https://github.com/angular/skills**.
When working on Angular tasks, consult these reference documents for up-to-date guidance:

| Task | Reference |
|---|---|
| Components, templates, `@if`/`@for`/`@switch` | `angular-developer` skill → `components.md` |
| Signal inputs, `model()`, transforms | `angular-developer` skill → `inputs.md` |
| Signal outputs, custom events | `angular-developer` skill → `outputs.md` |
| `signal()`, `computed()`, `untracked()` | `angular-developer` skill → `signals-overview.md` |
| `linkedSignal()`, derived writable state | `angular-developer` skill → `linked-signal.md` |
| `resource()`, async data loading | `angular-developer` skill → `resource.md` |
| Reactive Forms, Signals Forms (v21+) | `angular-developer` skill → `forms.md` |
| Routing, lazy loading, guards | `angular-developer` skill → `routing.md` |
| SSR, hydration | `angular-developer` skill → `ssr.md` |
| ARIA, accessibility | `angular-developer` skill → `angular-aria.md` |
| Animations | `angular-developer` skill → `angular-animations.md` |
| Angular CLI commands | `angular-developer` skill → `cli.md` |
| Unit & component testing | `angular-developer` skill → `testing.md` |
| E2E testing (Cypress) | `angular-developer` skill → `e2e-testing.md` |
| Dependency injection | `angular-developer` skill → `dependency-injection.md` |

> When in doubt about an Angular API or pattern, **check angular.dev first**, not training data.
> Angular evolves fast — always prefer the latest signals/standalone patterns.

---

## 🧱 Stack Overview

- **Framework**: Angular 19 (standalone components, signals-first)
- **Monorepo**: Nx
- **Language**: TypeScript (strict mode)
- **Styling**: SCSS + CSS custom properties
- **State**: Angular Signals + RxJS (interop only where needed)
- **Testing**: Jest (unit) + Cypress or Playwright (e2e)
- **Linting**: ESLint + Prettier

> Update this section to reflect your actual stack (e.g. NgRx, TailwindCSS, Angular Material, PrimeNG).

---

## 🅰️ Angular Best Practices

### Components

- **Always use standalone components** — no NgModules unless integrating legacy libs
- **Default to `OnPush` change detection** on every component
- Use `input()`, `output()`, and `model()` signals instead of `@Input()` / `@Output()` decorators
- Use `inject()` for dependency injection — never constructor injection
- Keep components small and focused; extract logic into services or composables
- Prefer `@defer` blocks for lazy rendering of heavy or below-the-fold content
- Use `@if`, `@for`, `@switch` (Angular 17+ control flow) — never `*ngIf` / `*ngFor`

```typescript
// ✅ Preferred
@Component({
  selector: 'app-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (user(); as u) {
      <div class="card">{{ u.name }}</div>
    }
  `
})
export class UserCardComponent {
  user = input.required<User>();
  private userService = inject(UserService);
}
```

### Signals & State

- Use `signal()`, `computed()`, and `effect()` for local and shared state
- Prefer `toSignal()` to bridge RxJS observables into the signals world
- Use `linkedSignal()` for derived writable state
- Avoid `effect()` for side effects that belong in services; use `afterRenderEffect()` for DOM work
- Keep signals close to where they're used; lift to a service only when shared across routes

### Services

- Use `providedIn: 'root'` for singleton services
- Use `providedIn: 'platform'` only for truly cross-app shared state
- Scope services to a route or feature with `providers: []` on the route config
- Keep services focused — one responsibility per service

### Routing

- **Lazy load every feature route** using `loadComponent` or `loadChildren`
- Use typed router parameters with `withComponentInputBinding()`
- Define route guards as functions (`CanActivateFn`) not classes
- Co-locate route definitions with the feature (`feature.routes.ts`)

```typescript
// ✅ Lazy route
{
  path: 'dashboard',
  loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
}
```

### Forms

- Use **Reactive Forms** for anything non-trivial
- Use typed forms (`FormControl<string>`) — avoid untyped forms
- Validate at the control level with `Validators` and custom validator functions
- Do not put form logic in templates beyond simple binding

### RxJS

- Keep RxJS at the edges (HTTP, WebSockets, event streams)
- Always unsubscribe: prefer `takeUntilDestroyed()` over manual subscriptions
- Use `toSignal()` to consume observables in components
- Avoid deeply nested `switchMap` / `mergeMap` chains — break into named streams

---

## 🏗️ Nx Monorepo Conventions

### Project Structure

```
apps/
  my-app/              # Deployable application(s)
libs/
  feature/             # Routed feature libraries (smart components)
  ui/                  # Dumb/presentational component libraries
  data-access/         # Services, API clients, state
  util/                # Pure functions, helpers, constants
  domain/              # Interfaces, types, enums (no Angular deps)
```

### Library Rules

- **`feature` libs** can depend on `ui`, `data-access`, `util`, `domain`
- **`ui` libs** depend only on `util` and `domain` — never on `data-access`
- **`data-access` libs** depend only on `util` and `domain`
- **`util` / `domain` libs** have zero Angular or external dependencies where possible
- Enforce boundaries with `@nx/enforce-module-boundaries` lint rule — never bypass it

### Generators

- Always use Nx generators to create new libs, components, and services:
  ```bash
  nx g @nx/angular:lib libs/feature/my-feature
  nx g @nx/angular:component my-component --project=my-feature
  ```
- Do not create files by hand inside `libs/` — use generators to keep config consistent

### Tags & Constraints

- Tag every project in `project.json`: `type:feature`, `type:ui`, `type:data-access`, `scope:shared`, `scope:admin`, etc.
- Define `depConstraints` in `.eslintrc` to enforce the dependency rules above

### Caching & CI

- Use Nx Cloud or local cache (`nx.json` `cacheableOperations`) for `build`, `test`, `lint`
- Run only affected projects in CI: `nx affected --target=test`
- Keep `nx.json` `targetDefaults` DRY — don't duplicate config per project

---

## 🔷 TypeScript Standards

- **`strict: true`** always — no exceptions
- No `any` — use `unknown` and narrow with type guards
- Prefer `type` over `interface` for data shapes; use `interface` for extensible contracts
- Use `readonly` on properties that should not be mutated
- Export types from `index.ts` barrel files at the lib root
- Use `satisfies` operator to validate object literals against a type without widening
- Avoid type assertions (`as`) — fix the type instead
- Name booleans with `is`, `has`, `can`, `should` prefixes

```typescript
// ✅ Good
type UserId = string & { readonly _brand: 'UserId' }; // branded types for IDs
const isAdmin = (user: User): user is AdminUser => user.role === 'admin';
```

---

## 🎨 UX & Design Principles

### Philosophy

- **Clarity first** — every element earns its place; remove before adding
- **Predictability** — UI behaves how users expect; no surprises
- **Responsiveness** — mobile-first; test at 375px, 768px, 1280px, 1440px
- **Accessibility** — WCAG 2.1 AA minimum; design for keyboard and screen reader from day one

### Visual Language

- Use a **design token system** via CSS custom properties:
  ```scss
  // Spacing scale (8px base)
  --space-1: 0.25rem;   // 4px
  --space-2: 0.5rem;    // 8px
  --space-3: 0.75rem;   // 12px
  --space-4: 1rem;      // 16px
  --space-6: 1.5rem;    // 24px
  --space-8: 2rem;      // 32px

  // Typography scale
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;

  // Semantic colours
  --color-primary: ...;
  --color-surface: ...;
  --color-on-surface: ...;
  --color-border: ...;
  --color-error: ...;
  ```
- **Never hardcode** colours, spacing, or font sizes inline — always use tokens
- Maintain a minimum **4.5:1 contrast ratio** for body text, **3:1** for large text

### Components & Patterns

- Prefer **composition over configuration** — build small primitives, compose them
- Provide clear **empty states**, **loading states**, and **error states** for every data-driven view
- Use **optimistic UI** where appropriate — update the UI immediately, roll back on error
- Skeleton loaders over spinners for content that has a known shape

### Motion & Animation

- Animate with purpose — guide attention, confirm actions, convey relationships
- Keep durations short: `150ms` for micro-interactions, `300ms` for transitions, `500ms` max for page transitions
- Always respect `prefers-reduced-motion`:
  ```scss
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- Use CSS transitions for simple state changes; Angular animations for route/list transitions

### Accessibility (a11y)

- All interactive elements must be reachable and operable by keyboard
- Use semantic HTML first — `<button>`, `<nav>`, `<main>`, `<article>` etc.
- Add `aria-label` or `aria-labelledby` when visual context is insufficient
- Manage focus explicitly on modal open/close and route transitions
- Test with VoiceOver (macOS/iOS) and NVDA (Windows) periodically
- Use Angular CDK `A11yModule` (`LiveAnnouncer`, `FocusTrap`) for dynamic content

---

## 🌐 Internationalisation (i18n)

- Use Angular's built-in i18n with `$localize` or `@angular/localize`
- Never hardcode user-facing strings — always mark with `i18n` attribute or `$localize` tag
- Store translations in XLIFF format under `src/locale/`
- Format dates, numbers, and currencies with Angular pipes (`DatePipe`, `CurrencyPipe`) using locale-aware options

---

## 🧪 Testing

- **Unit tests**: every service, pure function, and complex component gets a Jest spec
- **Component tests**: use `TestBed` with `ComponentFixture`; prefer `By.css` selectors over DOM queries
- **E2e tests**: cover critical user journeys only (login, checkout, core CRUD flows)
- Test behaviour, not implementation — don't test internal state, test what the user sees
- Name tests descriptively: `it('shows an error when the email is invalid')`
- Aim for **80%+ coverage** on `libs/` — not a vanity metric, a safety net

---

## 📁 File & Naming Conventions

| Artefact | Convention | Example |
|---|---|---|
| Component | `kebab-case.component.ts` | `user-card.component.ts` |
| Service | `kebab-case.service.ts` | `auth.service.ts` |
| Pipe | `kebab-case.pipe.ts` | `truncate.pipe.ts` |
| Guard | `kebab-case.guard.ts` | `auth.guard.ts` |
| Model/Type | `kebab-case.model.ts` | `user.model.ts` |
| Routes | `kebab-case.routes.ts` | `dashboard.routes.ts` |
| Spec | same name + `.spec.ts` | `user-card.component.spec.ts` |
| SCSS | same name + `.component.scss` | `user-card.component.scss` |

- One class/component per file
- Keep template, styles, and class in separate files for components > 50 lines
- Use `index.ts` barrel exports at the root of each lib

---

## 🚫 Anti-Patterns to Avoid

- ❌ NgModules (unless integrating old libraries)
- ❌ Constructor injection (use `inject()`)
- ❌ `*ngIf` / `*ngFor` (use `@if` / `@for`)
- ❌ `any` type
- ❌ Subscriptions without `takeUntilDestroyed()`
- ❌ Business logic in components (move to services)
- ❌ Importing across Nx boundary constraints
- ❌ Hardcoded colours, spacing, or strings
- ❌ `document.querySelector` in components (use `ElementRef` or CDK)
- ❌ `setTimeout` for timing hacks (use `afterNextRender` or proper lifecycle)

---

## 🤖 Claude-Specific Instructions

- When generating components, always use standalone + OnPush + signals
- When writing services, use `inject()` and `providedIn: 'root'`
- When suggesting state management, prefer signals; suggest RxJS only for streams
- When creating new Nx libs, follow the type/scope tagging convention above
- When writing SCSS, use the token variables — never raw values
- When fixing bugs, explain the root cause before showing the fix
- Prefer small, incremental changes over large rewrites
- When uncertain about project-specific conventions, ask before assuming
