import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiFade, TuiTabs } from '@taiga-ui/kit';

@Component({
  selector: 'app-page-subheader',
  imports: [TuiTabs],
  templateUrl: './page-subheader.component.html',
  styleUrl: './page-subheader.component.scss',
})
export class PageSubheaderComponent {
  protected readonly breadcrumbs = [
    'Home',
    'Angular',
    'Repositories',
    'Taiga UI',
  ];
}
