# SimpleBehaviourTree.ts

A simple, generic behavior tree implementation in TypeScript with Observation-Action pattern.

## Features

- **Generic Design**: Use TypeScript generics to define custom Observation and Action types
- **Observation-Action Pattern**: Each tick takes an Observation object and returns an Action object
- **Common Node Types**: Includes Sequence, Selector, Action, Condition, and Inverter nodes
- **Type-Safe**: Full TypeScript support with strict typing

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
│   ├── BehaviorTree.ts  # Core behavior tree implementation
│   └── Nodes.ts      # Common node implementations
├── dist/             # Compiled JavaScript output (generated)
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project metadata and dependencies
```

## Usage

### Basic Example

```typescript
import { 
  BehaviorTree, 
  IObservation, 
  IAction, 
  IBehaviorNode,
  IActionResult,
  NodeStatus 
} from 'simple-behaviour-tree';

// Define your observation type
interface GameObservation extends IObservation {
  playerHealth: number;
  enemyDistance: number;
}

// Define your action type
interface GameAction extends IAction {
  type: 'attack' | 'defend' | 'flee';
}

// Create a simple behavior node
const attackNode: IBehaviorNode<GameObservation, IActionResult<GameAction>> = {
  tick: (observation) => {
    if (observation.enemyDistance < 10) {
      return {
        status: NodeStatus.SUCCESS,
        action: { type: 'attack' }
      };
    }
    return { status: NodeStatus.FAILURE };
  }
};

// Create and run a behavior tree
const tree = new BehaviorTree(attackNode);
const observation: GameObservation = { 
  playerHealth: 100, 
  enemyDistance: 5 
};
const result = tree.tick(observation);
console.log(result); // { status: 'SUCCESS', action: { type: 'attack' } }
```

### Using Common Node Types

```typescript
import { 
  BehaviorTree,
  IObservation,
  IAction,
  IActionResult,
  NodeStatus,
  SequenceNode,
  SelectorNode,
  ActionNode,
  ConditionNode
} from 'simple-behaviour-tree';

interface GameObservation extends IObservation {
  playerHealth: number;
  enemyDistance: number;
  hasWeapon: boolean;
}

interface GameAction extends IAction {
  type: 'attack' | 'defend' | 'flee' | 'findWeapon';
}

// Create condition nodes
const isEnemyClose = new ConditionNode<GameObservation, GameAction>(
  (obs) => obs.enemyDistance < 10
);

const hasWeapon = new ConditionNode<GameObservation, GameAction>(
  (obs) => obs.hasWeapon
);

const isHealthy = new ConditionNode<GameObservation, GameAction>(
  (obs) => obs.playerHealth > 50
);

// Create action nodes
const attack = new ActionNode<GameObservation, GameAction>(
  (obs) => ({
    status: NodeStatus.SUCCESS,
    action: { type: 'attack' }
  })
);

const defend = new ActionNode<GameObservation, GameAction>(
  (obs) => ({
    status: NodeStatus.SUCCESS,
    action: { type: 'defend' }
  })
);

const flee = new ActionNode<GameObservation, GameAction>(
  (obs) => ({
    status: NodeStatus.SUCCESS,
    action: { type: 'flee' }
  })
);

const findWeapon = new ActionNode<GameObservation, GameAction>(
  (obs) => ({
    status: NodeStatus.SUCCESS,
    action: { type: 'findWeapon' }
  })
);

// Build a behavior tree:
// If enemy is close:
//   If has weapon and is healthy -> attack
//   If has weapon but not healthy -> defend
//   If no weapon -> find weapon
// Otherwise -> do nothing (patrol)
const combatBehavior = new SequenceNode<GameObservation, GameAction>([
  isEnemyClose,
  new SelectorNode<GameObservation, GameAction>([
    new SequenceNode<GameObservation, GameAction>([
      hasWeapon,
      isHealthy,
      attack
    ]),
    new SequenceNode<GameObservation, GameAction>([
      hasWeapon,
      defend
    ]),
    findWeapon
  ])
]);

const tree = new BehaviorTree(combatBehavior);

// Run the behavior tree
const observation: GameObservation = {
  playerHealth: 80,
  enemyDistance: 5,
  hasWeapon: true
};

const result = tree.tick(observation);
console.log(result); // { status: 'SUCCESS', action: { type: 'attack' } }
```

## API Reference

### Core Types

- **`IObservation`**: Base interface for observation data passed to the tree on each tick
- **`IAction`**: Base interface for action data returned by the tree on each tick
- **`IActionResult<A>`**: Action result that includes both the action data and node status
- **`NodeStatus`**: Enum with values `SUCCESS`, `FAILURE`, `RUNNING`
- **`IBehaviorNode<O, A>`**: Interface for behavior tree nodes
- **`BehaviorTree<O, A>`**: Main behavior tree class

### Node Types

- **`SequenceNode`**: Executes children in order until one fails
- **`SelectorNode`**: Executes children in order until one succeeds
- **`ActionNode`**: Wraps a simple action function
- **`ConditionNode`**: Checks a condition and returns success/failure
- **`InverterNode`**: Inverts the success/failure status of a child node

## License

MIT