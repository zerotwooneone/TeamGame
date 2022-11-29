import { Observable, Subject, Subscription } from "rxjs";
import { Disposable } from "./Disposable";


export class NullableObservablePropertyHelper<T> implements Disposable {
    readonly property: NullableObservableProperty<T>;
    readonly next: (value: T | null) => void;
    private readonly _subject: Subject<T | null>;
    constructor(value?: T | null, subject?: Subject<T | null>) {
        this._subject = subject ?? new Subject<T | null>();

        //we cannot use .bind(this) here
        this.next = v => { this._subject.next(v); };

        this.property = new NullableObservableProperty(this._subject);
        if (typeof value !== "undefined") {
            this.next(value);
        }
    }
    Dispose(): void {
        this._subject.complete();
        this.property.Dispose();
    }
}
export class NullableObservableProperty<T> implements Disposable {
    private _nullable: INullable<T> = EmptyNullable.default<T>();
    /**the last value, if one has been seen */
    get nullable(): INullable<T> {
        return this._nullable;
    }
    readonly observable$: Observable<T | null>;
    private readonly _subject: Subject<T | null>;
    private readonly _subscription: Subscription;
    constructor(subject: Subject<T | null>) {
        this._subject = subject;
        this.observable$ = this._subject.asObservable();
        this._subscription = this.observable$.subscribe(v => {
            this._nullable = new ValueNullable(v);
        });
    }
    Dispose(): void {
        this._subscription.unsubscribe();
    }
}
export class ObservablePropertyHelper<T> implements Disposable {
    readonly property: ObservableProperty<T>;
    readonly next: (value: T) => void;
    private readonly _subject: Subject<T>;
    constructor(value?: T, subject?: Subject<T>) {
        this._subject = subject ?? new Subject<T>();

        //we cannot use .bind(this) here
        this.next = v => { this._subject.next(v); };

        this.property = new ObservableProperty(this._subject);
        if (typeof value !== "undefined") {
            this.next(value);
        }
    }
    Dispose(): void {
        this._subject.complete();
        this.property.Dispose();
    }
}

export class ObservableProperty<T> implements Disposable {
    private _assignable: IAssignable<T> = EmptyNullable.default<T>();
    /**the last value, if one has been seen */
    get assignable(): IAssignable<T> {
        return this._assignable;
    }
    readonly observable$: Observable<T>;
    private readonly _subject: Subject<T>;
    private readonly _subscription: Subscription;
    constructor(subject: Subject<T>) {
        this._subject = subject;
        this.observable$ = this._subject.asObservable();
        this._subscription = this.observable$.subscribe(v => this._assignable = new ValueAssignable(v));
    }
    Dispose(): void {
        this._subscription.unsubscribe();
    }
}

export type IAssignable<T> =
    {
        value: T;
        hasBeenSet: true;
    } |
    {
        value?: undefined;
        hasBeenSet: false;
    }

export class ValueAssignable<T>{
    readonly hasBeenSet: true = true;
    constructor(readonly value: T) { }
    withValue(value: T): ValueNullable<T> {
        return new ValueNullable<T>(value);
    }
}

export type INullable<T> =
    {
        value: T | null;
        hasBeenSet: true;
    } |
    {
        value?: undefined;
        hasBeenSet: false;
    }

export class EmptyNullable<T> {
    readonly hasBeenSet: false = false;
    readonly value: undefined = undefined;
    static default<U>() { return new EmptyNullable<U>(); }
    withValue(value: T): ValueNullable<T> {
        return new ValueNullable<T>(value);
    }
}

export class ValueNullable<T>{
    readonly hasBeenSet: true = true;
    constructor(readonly value: T | null) { }
    withValue(value: T): ValueNullable<T> {
        return new ValueNullable<T>(value);
    }
}
