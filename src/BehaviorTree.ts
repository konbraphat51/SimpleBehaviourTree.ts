/**
 * Status returned by behavior tree nodes
 */
export enum NodeStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING'
}

/**
 * Base interface for Observation data passed to behavior tree on each tick
 */
export interface IObservation {}

/**
 * Base interface for Action data returned by behavior tree on each tick
 */
export interface IAction {}

/**
 * Base interface for behavior tree nodes
 * @template O - Observation type
 * @template A - Action type
 */
export interface IBehaviorNode<O extends IObservation = IObservation, A extends IAction = IAction> {
  tick(observation: O): A;
}

/**
 * Generic Behavior Tree implementation
 * @template O - Observation type that extends IObservation
 * @template A - Action type that extends IAction
 */
export class BehaviorTree<O extends IObservation = IObservation, A extends IAction = IAction> {
  private root: IBehaviorNode<O, A> | null = null;

  constructor(root?: IBehaviorNode<O, A>) {
    if (root) {
      this.root = root;
    }
  }

  /**
   * Set the root node of the behavior tree
   */
  public setRoot(root: IBehaviorNode<O, A>): void {
    this.root = root;
  }

  /**
   * Execute one tick of the behavior tree
   * @param observation - The observation data for this tick
   * @returns The action to be executed
   * @throws Error if no root node is set
   */
  public tick(observation: O): A {
    if (!this.root) {
      throw new Error('BehaviorTree: No root node set');
    }
    return this.root.tick(observation);
  }
}
