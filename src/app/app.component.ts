import { TuiRoot, TuiTextfield } from '@taiga-ui/core';
import { Component } from '@angular/core';
import PageHeaderComponent from './layout/page-header/page-header.component';
import { PageSubheaderComponent } from './layout/page-subheader/page-subheader.component';
import { WeatherCityComponent } from './components/weather-city/weather-city.component';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SettingService } from './services/setting.service';

@Component({
  selector: 'app-root',
  imports: [
    TuiRoot,
    PageHeaderComponent,
    TuiTextfield,
    PageSubheaderComponent,
    WeatherCityComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'weather-forecast';
  readonly prefix = '/assets/i18n/';
  readonly suffix = '.json';

  constructor(
    private iconReg: SvgIconRegistryService,
    private translate: TranslateService,
    private http: HttpClient,
    private settingService: SettingService
  ) {
    if (this.iconReg && this.iconReg.loadSvg) {
      this.iconReg
        .loadSvg('/svg/type=sun_x5F_cloud_1_.svg', 'cloudy')
        ?.subscribe();
    }

    this.translate.addLangs(['en', 'vi']);
    this.translate.setDefaultLang(this.settingService.locale);
    this.settingService.changeLocale$.subscribe((lag) => {
      this.translate.use(lag);
    });
  }

  get theme() {
    return this.settingService.theme;
  }
}
