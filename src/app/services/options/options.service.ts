import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OptionsInterface } from 'src/app/models/options.interface';

@Injectable({
    providedIn: 'root',
})
export class OptionsService {
    private optionsConfig: OptionsInterface = {
        pageSectionExpanded: true,
        gridSectionExpanded: true,
    };

    optionsConfig$: BehaviorSubject<OptionsInterface> = new BehaviorSubject(this.optionsConfig);

    updateOptionsConfig(optionsConfig: Partial<OptionsInterface>): void {
        this.optionsConfig = { ...this.optionsConfig, ...optionsConfig };
        this.optionsConfig$.next(this.optionsConfig);
    }
}
