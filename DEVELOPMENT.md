# Development Guide

> Complete guide for developers working on this portfolio.

## Setup

### Requirements
- Node.js 18+
- Git
- npm/yarn/pnpm

### Installation

```bash
git clone https://github.com/Ccontacto/PortalioPresentacion2025.git
cd PortalioPresentacion2025
npm install
npm run dev
```

## Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code

## Project Structure

```
src/
├── components/    # Reusable components
├── sections/      # Main sections
├── contexts/      # React Context
├── data/          # i18n translations
├── hooks/         # Custom hooks
├── utils/         # Utilities
├── App.tsx        # Root component
└── main.tsx       # Entry point
```

## Development Workflow

1. Create branch: `git checkout -b feature/name`
2. Develop and test
3. Lint: `npm run lint && npm run format`
4. Commit: `git commit -m "feat: description"`
5. Push and create PR

## Best Practices

- Use TypeScript for type safety
- Functional components with React.FC
- Tailwind CSS for styling
- ARIA labels for accessibility
- Descriptive commit messages
- Code review before merge

## AI Agents

This repo includes Copilot agents. See AGENTS.md for more info.

**Happy coding!
