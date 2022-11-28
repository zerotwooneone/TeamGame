import { Subscription } from "rxjs";

export interface Disposable {
    Dispose(): void;
}

export class DisposableCollection implements Disposable {
    private _disposables: Disposable[];
    constructor(...disposables: readonly Disposable[]) {
        this._disposables = disposables.map(i => i) ?? [];
    }
    push(d: Disposable): void {
        this._disposables.push(d);
    }
    pushSubscription(s: Subscription) {
        this.push({ Dispose: () => s.unsubscribe() });
    }
    Dispose(): void {
        for (const disposable of this._disposables) {
            try {
                disposable.Dispose();
            } catch {
                //ignore
            }
        }
    }
    /**attempts to dispose each item and then empties the collection */
    empty(): void {
        this.Dispose();
        this._disposables = [];
    }
}
