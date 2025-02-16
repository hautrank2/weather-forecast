import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiAppearance, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { environment } from '../../../environments/environment';
import {
  WeatherCondition,
  WeatherConfig,
  WeatherData,
} from '../../../models/weather';
import { TuiCardLarge, TuiCardMedium } from '@taiga-ui/layout';
import { CommonModule, DatePipe } from '@angular/common';
import { getValueFromPath } from '../../../utils/common';
import { TuiAvatar } from '@taiga-ui/kit';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { ECBasicOption } from 'echarts/types/dist/shared';
import { finalize, forkJoin, Subject, tap } from 'rxjs';
echarts.use([
  LineChart,
  GridComponent,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
]);

@Component({
  selector: 'app-weather-city',
  imports: [
    TuiTextfield,
    FormsModule,
    TuiAppearance,
    CommonModule,
    TuiCardLarge,
    TuiAvatar,
    TuiTitle,
    NgxEchartsDirective,
    ReactiveFormsModule,
    TuiCardMedium,
  ],
  templateUrl: './weather-city.component.html',
  styleUrl: './weather-city.component.scss',
  providers: [DatePipe, provideEchartsCore({ echarts })],
})
export class WeatherCityComponent implements OnInit {
  data = signal<WeatherData | null>(null);
  featureData = signal<WeatherData[]>([]);
  readonly formatData = 'yyyy-MM-dd';
  readonly forecastDays = 5; // Number of days for forecast (from today)
  form: FormGroup;
  private searchSubject = new Subject<string>();
  loading: boolean = false;
  weatherConfig = signal<WeatherConfig[]>([]);

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      city: [localStorage.getItem('dashboard-city') || 'Ha Noi'],
    });

    this.fetchData(this.form.value['city']);
    this.form.get('city')?.valueChanges.subscribe((city) => {
      this.searchSubject.next(city);
    });

    this.http
      .get<WeatherConfig[]>('https://www.weatherapi.com/docs/conditions.json')
      .subscribe((res) => {
        this.weatherConfig.set(res);
      });
  }

  submit() {
    const city = this.form.value['city'];
    localStorage.setItem('dashboard-city', city);
    this.fetchData(city);
  }

  getWeatherIcon(is_day: 0 | 1, condition?: WeatherCondition): string {
    return condition
      ? `https://cdn.weatherapi.com/weather/64x64/${is_day ? 'day' : 'night'}/${
          condition.code
        }.png`
      : 'Not found';
  }

  get city() {
    return this.form.get('city')?.value;
  }

  get weatherData() {
    return this.data();
  }

  get currentTime() {
    return new Date();
  }

  get tempChartOptions(): ECBasicOption {
    // Create an array from 0 -> current hour Ex: [0, 1, 2, ...10] if current hour is 10
    const xAxisData = [];
    for (let i = 0; i < 24; i++) {
      xAxisData.push(`${i + 1}h`);
    }
    const data =
      this.data()?.forecast.forecastday[0]?.hour.map((item) => item.temp_c) ||
      [];

    return {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: 0,
        right: 0,
        top: 8,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        data: xAxisData,
        type: 'category',
        boundaryGap: true,
      },
      yAxis: {
        axisLabel: {
          formatter: '{value} °C',
        },
      },
      series: [
        {
          name: 'Temperature',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: 'rgb(255, 158, 68)',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)',
              },
              {
                offset: 1,
                color: 'rgba(255, 70, 132, 0)',
              },
            ]),
          },
          data,
          markPoint: {
            symbol: 'circle',
            data: data.map((value, index) => ({
              name: 'Temperature',
              yAxis: value,
              xAxis: index + 1,
            })),
          },
        },
      ],
      animationEasing: 'elasticOut',
    };
  }

  changeFormat(time: string): string {
    return this.datePipe.transform(new Date(time), 'dd/MM') || '';
  }

  private fetchData(q: string) {
    const observables = [];
    for (let i = 0; i < this.forecastDays; i++) {
      const today = new Date();
      const featureDay = new Date(today);
      featureDay.setDate(today.getDate() + i);
      observables.push(
        this.http.get<any>(`${environment.host}/forecast.json`, {
          params: {
            key: environment.apiKey,
            q,
            days: 1,
            dt: this.datePipe.transform(featureDay, this.formatData) || '',
          },
        })
      );
    }
    forkJoin(observables)
      .pipe(
        tap(() => (this.loading = true)),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (value) => {
          const featureData: WeatherData[] = [];
          if (Array.isArray(value)) {
            value.forEach((valueByDay, index) => {
              if (index === 0) {
                // today data
                this.data.set(valueByDay);
              } else {
                featureData.push(valueByDay);
              }
            });
          }
          this.featureData.set(featureData);
        },
      });
  }

  ngOnInit(): void {}

  onChangeCity(newValue: string) {
    this.city.set(newValue);
  }

  getRain(item: WeatherData): string {
    const hourData = item.forecast.forecastday[0].hour.map((e) => ({
      condition: e.condition,
      time: e.time,
    }));
    const rainHours = hourData
      .filter((hourData) => hourData.condition.text.includes('rain'))
      .map((hourData) => new Date(hourData.time).getHours());
    // Hanlde array: [ 3, 7, 8, 9, 10, 13, 14, 15] => [[3, 3], [7, 10], [13, 15]]
    const result: [number, number][] = [];
    for (let i = 0; i < rainHours.length; i++) {
      const iv = rainHours[i];
      let rs = iv;
      for (let j = i + 1; j < rainHours.length - 1; j++) {
        const jv = rainHours[j];
        if (jv === iv + 1) {
          rs = jv;
          rainHours.splice(j, 1);
        } else {
          result.push([iv, rs]);
          break;
        }
      }
    }

    if (result.length === 0) return 'No rain';
    return `Rain times: ${result
      .map(([start, end]) => {
        if (start === end) return `${start}h`;
        return `${start}h-${end}h`;
      })
      .join(', ')}`;
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
