import { OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    template: '',
    standalone: false,
})
export class UnsubscriberComponent implements OnDestroy {
    protected unsubscribe = new Subject<void>();

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
