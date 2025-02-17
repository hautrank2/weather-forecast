import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
    DatePipe,
    TranslatePipe,
  ],
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Ignore portal related code, it is only here to position drawer inside the example block
  providers: [TuiDropdownService, tuiAsPortal(TuiDropdownService)],
})
export default class PageHeaderComponent
  extends TuiPortals
  implements OnInit, OnDestroy, AfterViewInit
{
  lang: string = '';
  langForm = new FormControl<string | null>(null);
  currentTime = new Date();
  timeOutId: any;

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
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
    return ['vi', 'en'];
  }

  get lag() {
    return;
  }

  getLag() {
    return this.langForm.value || 'en';
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.timeOutId = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeOutId);
  }
}
