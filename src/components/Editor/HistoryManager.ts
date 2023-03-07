

class HistoryManager<Sign> {
  history: Sign[];
  future: Sign[];

  constructor() {
    this.history = [];
    this.future = [];
  }

  push(current: Sign): void {
    this.history.push(current);
  }

  undo(current: Sign): Sign | undefined {
    if (this.history.length === 0) return undefined;
    const item = this.history.pop();
    this.future.push(current);
    if (item) return item;
    return undefined;
  }
  redo(current: Sign): Sign | undefined {
    if (this.future.length === 0) return undefined;
    const item = this.future.pop();
    this.history.push(current);
    if (item) return item;

    return undefined;
  }
  clear(): void {
    this.history = [];
    this.future = [];
  }
}

export default HistoryManager;
