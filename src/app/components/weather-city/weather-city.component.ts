import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiAppearance, TuiTextfield } from '@taiga-ui/core';
import { environment } from '../../../environments/environment';
import { WeatherData } from '../../../models/weather';
import { TuiCardMedium } from '@taiga-ui/layout';

@Component({
  selector: 'app-weather-city',
  imports: [TuiTextfield, FormsModule, TuiCardMedium, TuiAppearance],
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
  }

  ngOnInit(): void {}

  onChangeCity(newValue: string) {
    this.city.set(newValue);
  }
}
