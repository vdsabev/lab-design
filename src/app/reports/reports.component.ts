import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  constructor(private router: Router) {
  }

  loadReport(id: string) {
    this.router.navigate(['reports', id]);
  }
}
