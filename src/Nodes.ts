/**
 * Common behavior tree node implementations
 */

import { IBehaviorNode, IObservation, IAction, NodeStatus } from './BehaviorTree';

/**
 * Action result that includes both the action data and the node status
 */
export interface IActionResult<A extends IAction = IAction> {
  status: NodeStatus;
  action?: A;
}

/**
 * Sequence node - executes children in order until one fails
 * Returns the action from the last executed child
 */
export class SequenceNode<O extends IObservation = IObservation, A extends IAction = IAction> 
  implements IBehaviorNode<O, IActionResult<A>> {
  
  constructor(private children: IBehaviorNode<O, IActionResult<A>>[]) {}

  tick(observation: O): IActionResult<A> {
    if (this.children.length === 0) {
      return { status: NodeStatus.SUCCESS };
    }
    
    let lastResult: IActionResult<A> = { status: NodeStatus.SUCCESS };
    for (const child of this.children) {
      const result = child.tick(observation);
      lastResult = result;
      if (result.status === NodeStatus.FAILURE || result.status === NodeStatus.RUNNING) {
        return result;
      }
    }
    return lastResult;
  }
}

/**
 * Selector node - executes children in order until one succeeds
 * Returns the action from the first successful child
 */
export class SelectorNode<O extends IObservation = IObservation, A extends IAction = IAction> 
  implements IBehaviorNode<O, IActionResult<A>> {
  
  constructor(private children: IBehaviorNode<O, IActionResult<A>>[]) {}

  tick(observation: O): IActionResult<A> {
    if (this.children.length === 0) {
      return { status: NodeStatus.FAILURE };
    }
    
    let lastResult: IActionResult<A> = { status: NodeStatus.FAILURE };
    for (const child of this.children) {
      const result = child.tick(observation);
      lastResult = result;
      if (result.status === NodeStatus.SUCCESS || result.status === NodeStatus.RUNNING) {
        return result;
      }
    }
    return lastResult;
  }
}

/**
 * Action node - wraps a simple action function
 */
export class ActionNode<O extends IObservation = IObservation, A extends IAction = IAction> 
  implements IBehaviorNode<O, IActionResult<A>> {
  
  constructor(private actionFn: (observation: O) => IActionResult<A>) {}

  tick(observation: O): IActionResult<A> {
    return this.actionFn(observation);
  }
}

/**
 * Condition node - checks a condition and returns success/failure without action
 */
export class ConditionNode<O extends IObservation = IObservation, A extends IAction = IAction> 
  implements IBehaviorNode<O, IActionResult<A>> {
  
  constructor(private conditionFn: (observation: O) => boolean) {}

  tick(observation: O): IActionResult<A> {
    const success = this.conditionFn(observation);
    return { status: success ? NodeStatus.SUCCESS : NodeStatus.FAILURE };
  }
}

/**
 * Inverter decorator - inverts the success/failure status of a child node
 */
export class InverterNode<O extends IObservation = IObservation, A extends IAction = IAction> 
  implements IBehaviorNode<O, IActionResult<A>> {
  
  constructor(private child: IBehaviorNode<O, IActionResult<A>>) {}

  tick(observation: O): IActionResult<A> {
    const result = this.child.tick(observation);
    if (result.status === NodeStatus.SUCCESS) {
      return { ...result, status: NodeStatus.FAILURE };
    } else if (result.status === NodeStatus.FAILURE) {
      return { ...result, status: NodeStatus.SUCCESS };
    }
    return result;
  }
}
