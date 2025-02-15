import { HttpClient } from '@angular/common/http';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiAppearance, TuiTextfield } from '@taiga-ui/core';
import { environment } from '../../../environments/environment';
import { WeatherData } from '../../../models/weather';
import { TuiCardMedium } from '@taiga-ui/layout';
import { SvgIconComponent } from 'angular-svg-icon';
import { DatePipe } from '@angular/common';
import { getValueFromPath } from '../../../utils/common';

@Component({
  selector: 'app-weather-city',
  imports: [
    TuiTextfield,
    FormsModule,
    TuiCardMedium,
    TuiAppearance,
    SvgIconComponent,
    DatePipe,
  ],
  templateUrl: './weather-city.component.html',
  styleUrl: './weather-city.component.scss',
  providers: [],
})
export class WeatherCityComponent implements OnInit {
  city = signal('');
  data = signal<WeatherData | null>(null);

  constructor(private http: HttpClient) {
    this.http
      .get<any>(`${environment.host}/current.json`, {
        params: { key: environment.apiKey, q: 'London', api: 'no' },
      })
      .subscribe((res) => {
        this.data.set(res);
      });

    effect(() => {
      console.log('Current weather', this.data());
    });
  }

  get weatherData() {
    return this.data();
  }

  get currentTime() {
    return new Date();
  }

  ngOnInit(): void {}

  onChangeCity(newValue: string) {
    this.city.set(newValue);
  }

  readonly oneCardInfors = [
    {
      title: 'Độ ẩm',
      unit: '%',
      icon: 'thermostat',
      dataIndex: ['current', 'humidity'],
      getValue: (data: WeatherData, dataIndex: string[]) => {
        return getValueFromPath(data, dataIndex);
      },
    },
    {
      title: 'Tốc độ gió',
      unit: 'km/h',
      icon: 'air',
      dataIndex: ['current', 'gust_kph'],
      getValue: (data: WeatherData, dataIndex: string[]) => {
        return getValueFromPath(data, dataIndex);
      },
    },
    {
      title: 'Mây',
      unit: '%',
      icon: 'filter_drama',
      dataIndex: ['current', 'cloud'],
      getValue: (data: WeatherData, dataIndex: string[]) => {
        return getValueFromPath(data, dataIndex);
      },
    },
    {
      title: 'Mưa',
      unit: 'mm',
      icon: 'filter_drama',
      dataIndex: ['current', 'precip_mm'],
      getValue: (data: WeatherData, dataIndex: string[]) => {
        return getValueFromPath(data, dataIndex);
      },
    },
    {
      title: 'Tầm nhìn',
      unit: 'km',
      icon: 'visibility',
      dataIndex: ['current', 'vis_km'],
      getValue: (data: WeatherData, dataIndex: string[]) => {
        return getValueFromPath(data, dataIndex);
      },
    },
    {
      title: 'UV',
      unit: '',
      icon: 'show_chart',
      dataIndex: ['current', 'vis_km'],
      getValue: (data: WeatherData, dataIndex: string[]) => {
        return getValueFromPath(data, dataIndex);
      },
    },
  ];

  readonly weatherInfor = [
    {
      type: 'Cloudy',
      icon: 'cloudy',
    },
  ];
}
