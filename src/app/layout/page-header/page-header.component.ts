import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { tuiAsPortal, TuiPortals } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiDataList,
  TuiDropdown,
  TuiDropdownService,
  TuiIcon,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiAvatar, TuiDataListWrapper, TuiFade, TuiTabs } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import {
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

@Component({
  standalone: true,
  selector: 'app-page-header',
  imports: [
    FormsModule,
    TuiAppearance,
    TuiAvatar,
    TuiDataList,
    TuiDropdown,
    TuiFade,
    TuiIcon,
    TuiNavigation,
    TuiTabs,
    TuiTextfield,
    TuiDataListWrapper,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Ignore portal related code, it is only here to position drawer inside the example block
  providers: [TuiDropdownService, tuiAsPortal(TuiDropdownService)],
})
export default class PageHeaderComponent extends TuiPortals {
  lang: string = '';
  langForm = new FormControl<string | null>(null);

  constructor(private translateService: TranslateService) {
    super();

    this.langForm.setValue(this.translateService.getDefaultLang());
    this.langForm.valueChanges.subscribe((lag) => {
      if (lag) {
        this.translateService.use(lag);
        localStorage.setItem('lang', lag);
      }
    });
  }

  get lagOptions() {
    return ['Vi', 'En'];
  }
}
