import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-report',
  styleUrls: ['./report.component.scss'],
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {
  loading = true;
  Math = Math;
  report: Report;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => this.loadReport(params['id']));
  }

  loadReport(reportId: string) {
    this.loading = true;
    const db = firebase.database();
    const reportRef = db.ref(`/reports/${reportId}`);
    reportRef.off('value');
    reportRef.on('value', (reportSnapshot: { val: () => Report }) => {
      this.report = reportSnapshot.val();
      const tests = this.report.tests;
      this.report.tests = {};

      const stopLoading = _.after(_.size(tests), () => this.loading = false);

      _.each(tests, (test, testId) => {
        const testRef = db.ref(`/tests/${testId}`);
        testRef.off('value');
        testRef.on('value', (testSnapshot: { val: () => Test }) => {
          stopLoading();
          this.report.tests[testId] = _.extend(testSnapshot.val(), test);
          this.changeDetector.detectChanges();
        });
      });
    });
  }
}
