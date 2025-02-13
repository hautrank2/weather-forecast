import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-weather-city',
  imports: [TuiTextfield, FormsModule],
  templateUrl: './weather-city.component.html',
  styleUrl: './weather-city.component.scss',
  providers: [],
})
export class WeatherCityComponent implements OnInit {
  city = signal('');

  constructor(private http: HttpClient) {
    this.http
      .get<any>(`${environment.host}/current.json`, {
        params: { key: environment.apiKey, q: 'London', api: 'no' },
      })
      .subscribe((res) => {
        console.log(res);
      });
  }

  ngOnInit(): void {}

  onChangeCity(newValue: string) {
    this.city.set(newValue);

    console.log(this.city());
  }
}
