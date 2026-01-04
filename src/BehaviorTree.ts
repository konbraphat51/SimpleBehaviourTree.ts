/**
 * Status returned by behavior tree nodes
 */
export enum NodeStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING'
}

/**
 * Base interface for behavior tree nodes
 */
export interface IBehaviorNode {
  tick(): NodeStatus;
}

/**
 * Simple Behavior Tree implementation
 */
export class BehaviorTree {
  private root: IBehaviorNode | null = null;

  constructor(root?: IBehaviorNode) {
    if (root) {
      this.root = root;
    }
  }

  /**
   * Set the root node of the behavior tree
   */
  public setRoot(root: IBehaviorNode): void {
    this.root = root;
  }

  /**
   * Execute one tick of the behavior tree
   */
  public tick(): NodeStatus {
    if (!this.root) {
      return NodeStatus.FAILURE;
    }
    return this.root.tick();
  }
}
