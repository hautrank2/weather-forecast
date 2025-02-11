import { TuiRoot, TuiTextfield } from '@taiga-ui/core';
import { Component } from '@angular/core';
import PageHeaderComponent from './layout/page-header/page-header.component';
import { PageSubheaderComponent } from './layout/page-subheader/page-subheader.component';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, PageHeaderComponent, TuiTextfield, PageSubheaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'weather-forecast';
}
