## open-loopback

**Beautiful, embeddable feedback widget for React.**

`open-loopback` is a polished, themeable feedback component you can drop into any React app.  
It supports modal and embedded layouts, emoji/star/number ratings, rich theming (including dark mode), and both controlled and uncontrolled usage.

![](https://raw.githubusercontent.com/open-loopback/loopback/refs/heads/main/public/assets/widget.png)

---

### Installation

```bash
npm install open-loopback
# or
yarn add open-loopback
# or
pnpm add open-loopback
```

**Peer dependencies**

Make sure your project has:

- **react** ≥ 16.8.0
- **react-dom** ≥ 16.8.0

---

### Quick Start

#### Modal widget (uncontrolled)

```tsx
import React from "react";
import { Loopback } from "open-loopback";
import "open-loopback/style.css"; // include styles

export function App() {
  return (
    <div>
      <h1>My App</h1>
      <Loopback
        sourceId="my-product"
        variant="modal"
        position="bottom-right"
        defaultOpen={false}
      />
    </div>
  );
}
```

#### Embedded widget (inline card)

```tsx
import React from "react";
import { Loopback } from "open-loopback";
import "open-loopback/style.css";

export function FeedbackSection() {
  return (
    <section style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <Loopback
        sourceId="docs-section"
        variant="embedded"
        ratingType="emoji"
        content={{
          title: "How helpful was this page?",
          subtitle: "Your feedback helps us improve.",
        }}
      />
    </section>
  );
}
```

---

### Component Overview

The main export is:

- **`Loopback`** – the feedback UI component
- **`LoopbackProps`** – TypeScript props interface (re-exported)

You'll typically import it like:

```ts
import { Loopback } from "open-loopback";
```

…and once at app entry:

```ts
import "open-loopback/style.css";
```

---

### Props

#### `LoopbackProps`

- **sourceId** (`string`, required)  
  Unique identifier for the feedback source (e.g. `"homepage-hero"`, `"pricing-page"`, `"docs-search"`).

- **variant** (`"modal" | "embedded"`)

  - `"modal"`: Floating trigger button + overlay card.
  - `"embedded"`: Renders the card inline where you place the component.
  - **Default**: `"modal"`.

- **position** (`"bottom-right" | "bottom-left" | "center"`)  
  Position of the modal trigger/overlay.  
  **Default**: `"bottom-right"`.

- **ratingType** (`"emoji" | "star" | "number"`)  
  How the rating scale is displayed.  
  **Default**: `"emoji"`.

- **ratingItems** (`LoopbackRatingItem[]`)  
  Custom rating items if you want your own scale.

  Each `LoopbackRatingItem` is:

  - **value** (`number`)
  - **label** (`ReactNode`)

  If omitted, the widget uses:

  - Emojis 😭 → 🤩 for `"emoji"`,
  - 1–5 numeric scale for `"star"` / `"number"`.

- **isOpen** (`boolean`)  
  Control prop for the modal’s open state.  
  When set, the component becomes **controlled** – you must handle open/close state yourself and respond to `onClose`.

- **defaultOpen** (`boolean`)  
  Initial open state for uncontrolled modal usage.  
  **Default**: `false`.

- **onClose** (`() => void`)  
  Called when the widget should close (close button or after a successful submit).  
  Use this to toggle your own `isOpen` state when in controlled mode.

- **showTrigger** (`boolean`)  
  Show the floating trigger button for `variant="modal"` in uncontrolled mode.

  - Set to `false` if you want to render your own button and control `isOpen` manually.
  - **Default**: `true`.

- **triggerAriaLabel** (`string`)  
  Accessible label for the trigger button.  
  **Default**: `"Open feedback"`.

- **theme** (`LoopbackTheme`)  
  Theming options (see **Theming** below).

- **content** (`LoopbackContent`)  
  Custom copy and labels, e.g. headings, helper text, button labels.

- **className** (`string`)  
  Additional class name on the outer wrapper (`lb-root`).

- **cardStyle** (`React.CSSProperties`)  
  Inline style overrides for the card itself.

- **triggerStyle** (`React.CSSProperties`)  
  Inline style overrides for the floating trigger button.

---

### Theming

Use the `theme` prop to tune colors, radius, and dark mode.

#### `LoopbackTheme`

- **primaryColor?** (`string`) – Accent color (buttons, active states).
- **backgroundColor?** (`string`) – Card background.
- **textColor?** (`string`) – Primary text color.
- **accentColor?** (`string`) – Subtle accent background.
- **borderColor?** (`string`) – Card + input border color.
- **borderRadius?** (`string`) – Radius for the card and elements.
- **fontFamily?** (`string`) – Custom font stack.
- **darkMode?** (`boolean`) – Opt into a dark-friendly style; fills in sensible dark defaults.
- **zIndex?** (`number`) – Stack order for modal overlay and trigger.

#### Example

```tsx
<Loopback
  sourceId="checkout"
  variant="modal"
  position="center"
  ratingType="star"
  theme={{
    primaryColor: "#f97316",
    backgroundColor: "#020617",
    textColor: "#e5e7eb",
    darkMode: true,
    borderRadius: "16px",
    zIndex: 9999,
  }}
/>
```

Under the hood, the widget maps these values to CSS variables like:

- `--lb-primary`
- `--lb-bg`
- `--lb-text`
- `--lb-border`
- `--lb-font-family`
- `--lb-z-index`
- etc.

You can further customize styling in your own CSS by targeting:

- `.lb-root`
- `.lb-widget-overlay`
- `.lb-widget-trigger`
- `.lb-widget-card`
- `.lb-textarea`
- `.lb-submit-btn`
- …

---

### Controlled vs Uncontrolled

You can let the widget manage its own open/close state or wire it to your own UI.

#### Uncontrolled (simplest)

```tsx
<Loopback
  sourceId="homepage"
  variant="modal"
  defaultOpen={false}
  showTrigger={true}
/>
```

The widget:

- Draws its own trigger button.
- Handles open/close internally.

#### Controlled (custom trigger)

```tsx
import React from "react";
import { Loopback } from "open-loopback";
import "open-loopback/style.css";

export function ControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Give feedback</button>

      <Loopback
        sourceId="pricing"
        variant="modal"
        isOpen={open}
        onClose={() => setOpen(false)}
        showTrigger={false} // hide built-in trigger
      />
    </>
  );
}
```

---

### License

**MIT**

You’re free to use, modify, and embed `open-loopback` in your own projects.
