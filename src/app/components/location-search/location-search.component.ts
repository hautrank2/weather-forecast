import { HttpClient, HttpParams } from '@angular/common/http';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiDataList, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Location } from '../../../models/location';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-location-search',
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    TuiDataList,
    TuiDataListWrapper,
    TuiInputModule,
    TuiLet,
    TuiTextfield,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.scss',
})
export class LocationSearchComponent implements OnChanges {
  @Input() defaultValue: string = '';
  @Output() onChangeValue = new EventEmitter<string>();

  protected readonly form = new FormGroup({
    location: new FormControl(this.defaultValue),
  });

  protected locations$: Observable<Location[]> =
    this.form.get('location')?.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap((value) => console.log('C', value)),
      switchMap((value) => {
        return this.fetchLocations(value);
      }),
      catchError(() => of([]))
    ) || of([]);

  constructor(private http: HttpClient) {}

  private fetchLocations(query: string | null): Observable<Location[]> {
    if (!query) return of([]);
    const params = new HttpParams()
      .set('key', environment.apiKey)
      .set('q', query);
    return this.http.get<Location[]>(`${environment.host}/search.json`, {
      params,
    });
  }

  onSubmit(event: any) {
    this.onChangeValue.emit(this.form.value.location || '');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultValue']) {
      this.form.setValue({ location: changes['defaultValue'].currentValue });
    }
  }

  protected onSelected(value: Location): void {
    this.onChangeValue.emit(`${value.lat},${value.lon}`);
  }
}
