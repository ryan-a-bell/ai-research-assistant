# Developer Guide for Aria

This guide will help you set up your development environment and build the Aria plugin for Zotero.

## Prerequisites

- **Node.js**: Version 14 or higher (recommended: LTS version)
- **npm**: Version 6 or higher (comes with Node.js)
- **Git**: For version control

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lifan0127/ai-research-assistant.git
cd ai-research-assistant
```

### 2. Install Dependencies

**Important**: This step is required before building the project.

```bash
npm install
```

This will:
- Install all required dependencies listed in `package.json`
- Run post-install scripts to apply patches
- Copy React patches to `node_modules`
- Set up the development environment

Expected output:
- ~1288 packages installed
- Patch-package applying patches for several dependencies
- Some deprecation warnings (safe to ignore)

## Available NPM Scripts

### Development Scripts

#### `npm start`
Starts the development server with hot reload.

```bash
npm start
```

This runs `zotero-plugin serve` which:
- Watches for file changes
- Automatically rebuilds on changes
- Serves the plugin to Zotero for testing

#### `npm run build`
Builds the plugin for production.

```bash
npm run build
```

This runs two commands in sequence:
1. `tsc --noEmit` - Type checks TypeScript files
2. `zotero-plugin build` - Builds the plugin package

**Note**: There are currently ~108 TypeScript type errors that don't prevent the build from completing. These are non-blocking compile-time issues.

#### `npm run build-libs`
Builds the WebAssembly libraries for vector search functionality.

```bash
npm run build-libs
```

This compiles the Rust-based vector search library using `wasm-pack`.

### Testing Scripts

#### `npm test`
Runs the test suite.

```bash
npm test
```

#### `npm run test-libs`
Tests the WebAssembly libraries.

```bash
npm run test-libs
```

### Maintenance Scripts

#### `npm run lint`
Formats code and fixes linting issues.

```bash
npm run lint
```

This runs:
- Prettier for code formatting
- ESLint with auto-fix

#### `npm run stop`
Stops the development server.

```bash
npm run stop
```

#### `npm run release`
Creates a new release of the plugin.

```bash
npm run release
```

## Build Process Explained

### TypeScript Compilation

The project uses TypeScript with the following configuration (`tsconfig.json`):

- **Target**: ES2016
- **Module**: CommonJS
- **JSX**: React
- **Strict mode**: Enabled

Some legacy files (langchain-dependent code) are excluded from compilation but don't affect the build.

### Plugin Bundling

The `zotero-plugin` CLI tool handles:
- Bundling scripts with esbuild
- Processing static assets
- Creating the `.xpi` package for Zotero
- Generating the addon structure

### Build Artifacts

After building, you'll find:
- `build/` - Contains the built `.xpi` file
- `addon/` - Contains the unpacked addon structure

## Development Workflow

### 1. Make Your Changes

Edit source files in the `src/` directory:
- `src/apis/` - API integrations (Zotero, OpenAI, etc.)
- `src/models/` - Core business logic
- `src/views/` - React components for UI
- `src/typings/` - TypeScript type definitions

### 2. Test During Development

```bash
npm start
```

This will watch for changes and reload automatically in Zotero.

### 3. Build for Production

```bash
npm run build
```

Or if you want to skip TypeScript type checking (since there are known non-blocking errors):

```bash
npx zotero-plugin build
```

### 4. Install in Zotero

1. Open Zotero
2. Go to Tools → Add-ons
3. Click the gear icon → "Install Add-on From File..."
4. Select the `.xpi` file from the `build/` directory

## Troubleshooting

### "Cannot find module" errors

**Problem**: Getting TypeScript errors about missing modules.

**Solution**: Make sure you've run `npm install`:
```bash
npm install
```

### Build fails immediately

**Problem**: `node_modules` directory is missing.

**Solution**: Install dependencies:
```bash
npm install
```

### Type errors during build

**Problem**: Seeing ~108 TypeScript type errors.

**Solution**: These are known issues and don't prevent the build. You can:
- Run `npx zotero-plugin build` directly to skip type checking
- Or ignore the errors - the build will still complete successfully

### Patch warnings during install

**Problem**: Seeing warnings about patch file version mismatches (e.g., openai@4.72.0 vs 4.79.1).

**Solution**: These warnings are safe to ignore. The patches are still applied successfully.

### Out of date browsers data

**Problem**: Warning about outdated browserslist data.

**Solution**: Run:
```bash
npx update-browserslist-db@latest
```

## Project Structure

```
ai-research-assistant/
├── src/                    # Source code
│   ├── apis/              # External API integrations
│   ├── db/                # Database and storage
│   ├── hooks/             # React hooks
│   ├── models/            # Business logic
│   ├── typings/           # TypeScript definitions
│   ├── utils/             # Utility functions
│   └── views/             # React components
├── assets/                # Static assets
├── libs/                  # WebAssembly libraries
├── patches/               # npm package patches
├── build/                 # Build output (generated)
├── addon/                 # Addon structure (generated)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── zotero-plugin.config.ts # Zotero plugin configuration
```

## Environment Variables

The project uses the following environment variables (configured in Zotero preferences):

- `OPENAI_API_KEY` - Your OpenAI API key for AI features

These are stored in Zotero's preferences system, not in `.env` files.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly with `npm start`
4. Run `npm run lint` to format code
5. Build with `npm run build` to verify
6. Commit your changes with descriptive messages
7. Push and create a pull request

## Additional Resources

- [Zotero Plugin Development Documentation](https://www.zotero.org/support/dev/zotero_plugin_development)
- [zotero-plugin-toolkit](https://github.com/windingwind/zotero-plugin-toolkit)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

## Getting Help

- Check the [main README](README.md) for general information
- Open an issue on GitHub for bugs or questions
- Review existing issues for known problems and solutions
