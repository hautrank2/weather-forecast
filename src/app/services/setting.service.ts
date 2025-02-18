import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private _locale = localStorage.getItem('lang') || 'vi';
  private changeLocaleSubject = new BehaviorSubject<string>(this._locale);
  changeLocale$ = this.changeLocaleSubject.asObservable();

  private _tempUnit = localStorage.getItem('tempUnit') || '°C';
  private changeTempUnitSubject = new BehaviorSubject<string>(this._locale);
  changeTempUnit$ = this.changeTempUnitSubject.asObservable();

  private _theme = localStorage.getItem('theme') || 'light';
  private changeThemeSubject = new BehaviorSubject<string>(this._theme);
  changeThemeUnit$ = this.changeThemeSubject.asObservable();

  constructor() {}

  get locale(): string {
    return this._locale;
  }

  get tempUnit(): string {
    return this._tempUnit;
  }

  get theme(): string {
    return this._theme;
  }

  changeLocale(newValue: string) {
    this._locale = newValue;
    this.changeLocaleSubject.next(newValue);
    localStorage.setItem('lang', newValue);
    window.location.reload(); // Cần reload để Angular cập nhật LOCALE_ID
  }

  changeTempUnit(newValue: string) {
    this._tempUnit = newValue;
    this.changeTempUnitSubject.next(newValue);
    localStorage.setItem('tempUnit', newValue);
  }

  changeTheme(newValue: string) {
    this._theme = newValue;
    this.changeTempUnitSubject.next(newValue);
    localStorage.setItem('theme', newValue);
  }
}
