import { TuiRoot, TuiTextfield } from '@taiga-ui/core';
import { Component } from '@angular/core';
import PageHeaderComponent from './layout/page-header/page-header.component';
import { PageSubheaderComponent } from './layout/page-subheader/page-subheader.component';
import { WeatherCityComponent } from './components/weather-city/weather-city.component';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private iconReg: SvgIconRegistryService,
    private translate: TranslateService
  ) {
    if (this.iconReg && this.iconReg.loadSvg) {
      this.iconReg
        .loadSvg('/svg/type=sun_x5F_cloud_1_.svg', 'cloudy')
        ?.subscribe();
    }

    this.translate.addLangs(['En', 'Vi']);
    this.translate.setDefaultLang(localStorage.getItem('lang') || 'En');
  }
}
