export type HdhiveSessionDone<T> = (value:T|null, error:string) => void;

export type HdhiveSessionOperation<T> = (done:HdhiveSessionDone<T>) => void;

export type HdhiveSessionTransportOperation = (release:() => void) => void;

export class HdhiveSessionGate<T = any> {
    private waiting:Array<HdhiveSessionDone<T>> = [];
    private running:boolean = false;

    public run(operation:HdhiveSessionOperation<T>, callback:HdhiveSessionDone<T>):void {
        this.waiting.push(callback);
        if (this.running) {
            return;
        }

        this.running = true;
        let finished:boolean = false;
        let done:HdhiveSessionDone<T> = (value:T|null, error:string):void => {
            if (finished) {
                return;
            }
            finished = true;

            let waiting = this.waiting;
            this.waiting = [];
            this.running = false;
            for (let callback of waiting) {
                try {
                    callback(value, error || "");
                } catch (callbackError) {
                    try {
                        console.error("HdhiveSessionGate waiter callback failed", callbackError);
                    } catch (reportError) {}
                }
            }
        };

        try {
            operation(done);
        } catch (error) {
            done(null, error instanceof Error ? error.message : String(error));
        }
    }
}

export class HdhiveSessionTransportQueue {
    private waiting:Array<HdhiveSessionTransportOperation> = [];
    private idleWaiters:Array<() => void> = [];
    private running:boolean = false;

    public enqueue(operation:HdhiveSessionTransportOperation):void {
        this.waiting.push(operation);
        this.drain();
    }

    public whenIdle(callback:() => void):void {
        if (!this.running && this.waiting.length == 0) {
            callback();
            return;
        }
        this.idleWaiters.push(callback);
    }

    private drain():void {
        if (this.running) {
            return;
        }
        let operation = this.waiting.shift();
        if (!operation) {
            let idleWaiters = this.idleWaiters;
            this.idleWaiters = [];
            for (let callback of idleWaiters) {
                try {
                    callback();
                } catch (callbackError) {
                    try { console.error("HDHive transport idle callback failed", callbackError); } catch (reportError) {}
                }
            }
            return;
        }

        this.running = true;
        let released:boolean = false;
        let release = ():void => {
            if (released) {
                return;
            }
            released = true;
            this.running = false;
            this.drain();
        };
        try {
            operation(release);
        } catch (operationError) {
            try { console.error("HDHive transport operation failed", operationError); } catch (reportError) {}
            release();
        }
    }
}

export function getRefreshDelayMs(expiresInSeconds:number):number {
    let seconds = Number(expiresInSeconds);
    if (!Number.isFinite(seconds) || seconds < 0) {
        seconds = 0;
    }
    return Math.max(1000, Math.floor((seconds - 60) * 1000));
}
