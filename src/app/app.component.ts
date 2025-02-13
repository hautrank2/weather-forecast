import { TuiRoot, TuiTextfield } from '@taiga-ui/core';
import { Component } from '@angular/core';
import PageHeaderComponent from './layout/page-header/page-header.component';
import { PageSubheaderComponent } from './layout/page-subheader/page-subheader.component';
import { WeatherCityComponent } from "./components/weather-city/weather-city.component";

@Component({
  selector: 'app-root',
  imports: [TuiRoot, PageHeaderComponent, TuiTextfield, PageSubheaderComponent, WeatherCityComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'weather-forecast';
}
