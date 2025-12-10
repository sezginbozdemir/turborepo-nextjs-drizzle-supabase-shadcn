## @repo/ui

This package is powered by [shadcn/ui](https://ui.shadcn.com/)

- `components.json` describes the shadcn config
- new components can be added by generating them via shadcn cli into `src./components`

---

### Usage

1. Ensure you import the global styles and export postcss config in your consuming app:

```ts
export { default } from "@repo/ui/postcss.config";
import "@repo/ui/globals.css";
```

2. Import components:

```ts
import { Alert } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
```
