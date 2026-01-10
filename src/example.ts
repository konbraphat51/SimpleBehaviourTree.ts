/**
 * Example usage of the Behavior Tree library
 */

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
} from './index';

// Define custom observation and action types
interface GameObservation extends IObservation {
  playerHealth: number;
  enemyDistance: number;
  hasWeapon: boolean;
}

interface GameAction extends IAction {
  type: 'attack' | 'defend' | 'flee' | 'findWeapon' | 'idle';
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
  (obs) => {
    console.log(`Attacking enemy at distance ${obs.enemyDistance}!`);
    return {
      status: NodeStatus.SUCCESS,
      action: { type: 'attack' }
    };
  }
);

const defend = new ActionNode<GameObservation, GameAction>(
  (obs) => {
    console.log(`Defending with low health (${obs.playerHealth})!`);
    return {
      status: NodeStatus.SUCCESS,
      action: { type: 'defend' }
    };
  }
);

const findWeapon = new ActionNode<GameObservation, GameAction>(
  (obs) => {
    console.log('Looking for a weapon!');
    return {
      status: NodeStatus.SUCCESS,
      action: { type: 'findWeapon' }
    };
  }
);

// Build a behavior tree
const combatBehavior = new SelectorNode<GameObservation, GameAction>([
  new SequenceNode<GameObservation, GameAction>([
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
  ])
]);

const tree = new BehaviorTree(combatBehavior);

// Test scenarios
console.log('=== Scenario 1: Healthy, armed, enemy close ===');
let observation: GameObservation = {
  playerHealth: 80,
  enemyDistance: 5,
  hasWeapon: true
};
let result = tree.tick(observation);
console.log('Result:', result);
console.log('');

console.log('=== Scenario 2: Weak, armed, enemy close ===');
observation = {
  playerHealth: 30,
  enemyDistance: 5,
  hasWeapon: true
};
result = tree.tick(observation);
console.log('Result:', result);
console.log('');

console.log('=== Scenario 3: Healthy, unarmed, enemy close ===');
observation = {
  playerHealth: 80,
  enemyDistance: 5,
  hasWeapon: false
};
result = tree.tick(observation);
console.log('Result:', result);
console.log('');

console.log('=== Scenario 4: Healthy, armed, enemy far ===');
observation = {
  playerHealth: 80,
  enemyDistance: 50,
  hasWeapon: true
};
result = tree.tick(observation);
console.log('Result:', result);
console.log('');
