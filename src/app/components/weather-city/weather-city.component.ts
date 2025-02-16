import { HttpClient } from '@angular/common/http';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiAppearance, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { environment } from '../../../environments/environment';
import { WeatherData } from '../../../models/weather';
import { TuiCardLarge } from '@taiga-ui/layout';
import { SvgIconComponent } from 'angular-svg-icon';
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
import { forkJoin } from 'rxjs';
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
    SvgIconComponent,
    CommonModule,
    TuiCardLarge,
    TuiAvatar,
    TuiTitle,
    NgxEchartsDirective,
  ],
  templateUrl: './weather-city.component.html',
  styleUrl: './weather-city.component.scss',
  providers: [DatePipe, provideEchartsCore({ echarts })],
})
export class WeatherCityComponent implements OnInit {
  city = signal('');
  data = signal<WeatherData | null>(null);
  featureData = signal<WeatherData[]>([]);
  readonly formatData = 'yyyy-MM-dd';
  readonly forecastDays = 5; // Number of days for forecast (from today)

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    effect(() => {
      console.log('featureData', this.featureData());
    });
  }

  get weatherData() {
    return this.data();
  }

  get currentTime() {
    return new Date();
  }

  get tempChartOptions(): ECBasicOption {
    // Create an array from 0 -> current hour Ex: [0, 1, 2, ...10] if current hour is 10
    const currentHour: number = +(
      this.datePipe.transform(this.currentTime, 'HH') || 0
    );
    const xAxisData = [];
    for (let i = 0; i < currentHour; i++) {
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

  ngOnInit(): void {
    const observables = [];
    for (let i = 0; i < this.forecastDays; i++) {
      const today = new Date();
      const featureDay = new Date(today);
      featureDay.setDate(today.getDate() + i);
      observables.push(
        this.http.get<any>(`${environment.host}/forecast.json`, {
          params: {
            key: environment.apiKey,
            q: 'Ha Noi',
            days: 1,
            dt: this.datePipe.transform(featureDay, this.formatData) || '',
          },
        })
      );
    }
    forkJoin(observables).subscribe({
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
