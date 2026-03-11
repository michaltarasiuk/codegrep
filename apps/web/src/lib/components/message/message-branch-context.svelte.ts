import { getContext, setContext } from "svelte";

export class MessageBranchState {
  registeredBranchIndexes = $state<number[]>([]);

  #readBranch: () => number;
  #writeBranch: (value: number) => void;
  #readOnBranchChange: () => ((value: number) => void) | undefined;

  constructor(
    readBranch: () => number,
    writeBranch: (value: number) => void,
    readOnBranchChange: () => ((value: number) => void) | undefined
  ) {
    this.#readBranch = readBranch;
    this.#writeBranch = writeBranch;
    this.#readOnBranchChange = readOnBranchChange;
  }

  get currentBranch() {
    return this.#readBranch();
  }

  get normalizedCurrentBranch() {
    return this.normalizeBranch(this.currentBranch);
  }

  get totalBranches() {
    return this.registeredBranchIndexes.length;
  }

  get hasMultipleBranches() {
    return this.totalBranches > 1;
  }

  get currentBranchPosition() {
    if (!this.totalBranches) {
      return 0;
    }

    const normalizedCurrentBranch = this.normalizedCurrentBranch;
    const position = this.registeredBranchIndexes.indexOf(
      normalizedCurrentBranch
    );
    return Math.max(0, position);
  }

  sortIndexes = (indexes: number[]) => {
    return indexes.toSorted((a, b) => a - b);
  };

  normalizeBranch = (value: number) => {
    if (!this.totalBranches) {
      return 0;
    }

    if (this.registeredBranchIndexes.includes(value)) {
      return value;
    }

    const nextBranch =
      this.registeredBranchIndexes.find((index) => index >= value) ??
      this.registeredBranchIndexes.at(-1);

    return nextBranch ?? 0;
  };

  ensureCurrentBranchIsValid = () => {
    this.setBranch(this.currentBranch);
  };

  getNextBranchIndex = () => {
    if (!this.totalBranches) {
      return 0;
    }

    const nextPosition = (this.currentBranchPosition + 1) % this.totalBranches;
    return this.registeredBranchIndexes[nextPosition] ?? 0;
  };

  getPreviousBranchIndex = () => {
    if (!this.totalBranches) {
      return 0;
    }

    const previousPosition =
      (this.currentBranchPosition - 1 + this.totalBranches) %
      this.totalBranches;
    return this.registeredBranchIndexes[previousPosition] ?? 0;
  };

  setBranch = (value: number) => {
    const next = this.normalizeBranch(value);
    const previous = this.currentBranch;

    if (next === previous) {
      return;
    }

    this.#writeBranch(next);
    this.#readOnBranchChange()?.(next);
  };

  registerBranch = (index: number) => {
    if (!this.registeredBranchIndexes.includes(index)) {
      this.registeredBranchIndexes = this.sortIndexes([
        ...this.registeredBranchIndexes,
        index,
      ]);
      this.ensureCurrentBranchIsValid();
    }

    return () => {
      this.registeredBranchIndexes = this.registeredBranchIndexes.filter(
        (value) => value !== index
      );
      this.ensureCurrentBranchIsValid();
    };
  };

  isCurrentBranch = (index: number) => {
    return this.normalizedCurrentBranch === index;
  };

  goToNext = () => {
    if (!this.hasMultipleBranches) {
      return;
    }

    this.setBranch(this.getNextBranchIndex());
  };

  goToPrevious = () => {
    if (!this.hasMultipleBranches) {
      return;
    }

    this.setBranch(this.getPreviousBranchIndex());
  };
}

const MESSAGE_BRANCH_KEY = Symbol.for("scn-message-branch");

export function getMessageBranch() {
  const value = getContext<MessageBranchState | undefined>(MESSAGE_BRANCH_KEY);
  if (!value) {
    throw new Error("Missing message branch context");
  }
  return value;
}

export function setMessageBranch(
  currentBranch: () => number,
  setCurrentBranch: (value: number) => void,
  readOnBranchChange: () => ((value: number) => void) | undefined
) {
  setContext(
    MESSAGE_BRANCH_KEY,
    new MessageBranchState(currentBranch, setCurrentBranch, readOnBranchChange)
  );
}
