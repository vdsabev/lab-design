import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  styleUrls: ['./reports.component.scss'],
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  constructor(private router: Router) {
  }

  loadReport(id: string) {
    this.router.navigate(['reports', id]);
  }
}
