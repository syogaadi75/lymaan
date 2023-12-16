# Immershift Lymaan

Immershift Lymaan adjuster app

## Features

- ⚡️ Vite
- ⚛️ React 17
- ⛑ TypeScript
- 💅 Tailwind + Antd for styling and components
- 📏 ESLint — Find and fix problems in your code
- 💖 Prettier — Code Formatter for consistent style
- ⚙️ EditorConfig - Maintain consistent coding styles across editors and IDEs
- 🗂 Path Mapping — Import components or images using the `~` prefix
- 👻 Jotai for State Management
- 📝 React Hook Form + Yup for handling nested forms and deep logic for forms validation
- Vitest or Jest for testing

## Quick Start

If you want to learn this repo using this command to cloning or create the app

```
git clone https://github.com/ImmerShift/limaanadjuster-frontend.git

// and run as well using yarn or npm
```

### Development

To start the project locally, run:

```bash
yarn dev
```

Open `http://localhost:5173` with your browser to see the result.

### Requirements

- Node.js >= 16
- Yarn 1 (Classic) or pnpm

### Directory Structure

- [`public`](./src/public) — Static assets such as robots.txt, images, and favicon.<br>
- [`src`](./src) — Application source code, including pages, components, styles, etc.

### Scripts

- `yarn dev` — Starts the application in development mode at `http://localhost:5173`.
- `yarn build` — Creates an optimized production build of your application.
- `yarn serve` — Starts the application in production mode.
- `yarn typecheck` — Validate code using TypeScript compiler.
- `yarn lint` — Runs ESLint for all files in the `src` directory.
- `yarn test:ui` — Runs testing for UI components.

### Path Mapping

TypeScript are pre-configured with custom path mappings. To import components or files, use the `~` prefix.

```tsx
import {Button} from "components/Button";

// To import images or other files from the public folder
import Avatar from "public/avatar.png";
```

### Switch to yarn or npm

By default, this starter uses yarn, but this choice is yours.`

### PR Workflow

Every PR should be formatting for example:
`feat: Adding cart feature`

This mean you give a explanation what you doing in your code.
`feat` mean you adding new feature and `adding cart feature` is description what you doing.

And every PR should be reviewed by one person
