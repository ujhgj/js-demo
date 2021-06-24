import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum INDICES {
    PREV,
    CURRENT,
    NEXT,
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
    private browserBacked = new Subject<void>();
    private browserForwarded = new Subject<void>();
    private isHistoryReset = false;

    constructor() {
        window.addEventListener('popstate', event => {
            // Last check means that reset is not in progress (history.back())
            if (event.state && event.state.index !== undefined && event.state.index !== INDICES.CURRENT) {
                // Browser back pushed
                if (event.state.index === INDICES.PREV) {
                    this.browserBacked.next();
                }


                //

                //

                //

                // Browser forward pushed
                if (event.state.index === INDICES.NEXT) {
                    this.browserForwarded.next();
                }
                this.isHistoryReset = false;
                this.reset();
            }
        });
    }
}
    /* Replacing current state, pushing two forward, and going back
       results in [0 - previous] [1 - current] [2 - next] */
    private reset() {
        /* Performing the check, that the history is "dirty"
           It can become dirty two ways:
              1. $stateChangeSuccess fired, meaning that ui-router invoked pushState
              2. popstate fired, meaning that we modified the history, move it back/forward
        */
        if (this.isHistoryReset === false) {
            history.replaceState({index: INDICES.PREV}, '', window.location.href);
            history.pushState({index: INDICES.CURRENT}, '', window.location.href);
            // REMOVED due to very low crossbrowserability
            // history.pushState({index: INDICES.NEXT}, "", this.$location.absUrl());
            // history.back();
            this.isHistoryReset = true;
        }
    }

    onBrowserBack(): Observable<void> {
        return this.browserBacked.asObservable();
    }

    onBrowserForward(): Observable<void> {
        return this.browserForwarded.asObservable();
    }
}
