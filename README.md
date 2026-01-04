# SimpleBehaviourTree.ts

A simple behavior tree implementation in TypeScript.

## Installation

```bash
pnpm install simple-behaviour-tree
```

## Development

This project uses [pnpm](https://pnpm.io/) as the package manager.

### Setup

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install
```

### Build

```bash
# Build the library
pnpm run build

# Clean build artifacts
pnpm run clean
```

### Project Structure

```
SimpleBehaviourTree.ts/
├── src/              # TypeScript source files
│   ├── index.ts      # Main entry point
│   └── BehaviorTree.ts  # Core behavior tree implementation
├── dist/             # Compiled JavaScript output (generated)
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project metadata and dependencies
```

## Usage

```typescript
import { BehaviorTree, NodeStatus, IBehaviorNode } from 'simple-behaviour-tree';

// Create a simple behavior node
const myNode: IBehaviorNode = {
  tick: () => {
    console.log('Node executed');
    return NodeStatus.SUCCESS;
  }
};

// Create and run a behavior tree
const tree = new BehaviorTree(myNode);
const result = tree.tick();
console.log(result); // SUCCESS
```

## License

MIT