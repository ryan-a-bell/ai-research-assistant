# Build Instructions

If you encounter issues building the plugin, follow these steps to ensure a clean and correct environment.

## Prerequisites

- Node.js (v18 or v20 recommended)
- NPM

## Fix Dependency Conflicts

The project has peer dependency conflicts between `react` versions. To fix this, you must pin React to version 18.3.1 in `package.json`.

Ensure your `package.json` contains:

```json
  "dependencies": {
    ...
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "uuid": "9.0.1",
    ...
  }
```

## Fresh Install

1.  Remove existing artifacts:
    ```powershell
    Remove-Item -Recurse -Force node_modules, package-lock.json
    ```

2.  Install dependencies:
    ```powershell
    npm install
    ```

## Manual Patching

The `postinstall` script might fail on Windows. You need to manually copy the patched React files:

```powershell
Copy-Item -Recurse -Force patches/react node_modules/
Copy-Item -Recurse -Force patches/react-dom node_modules/
```

## Build

To build the `.xpi` file:

```powershell
# Standard build (might fail on tsc type checking)
npm run build

# Direct build (bypasses tsc strict checks if necessary)
npx zotero-plugin build
```

The output file will be located at `build/aria.xpi`.
