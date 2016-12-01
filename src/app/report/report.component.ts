import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  maxLowPercent = 0;
  maxHighPercent = 0;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.forEach((params) => this.loadReport(params['id']));
  }

  loadReport(reportId: string) {
    this.loading = true;
    const db = firebase.database();
    const reportRef = db.ref(`/reports/${reportId}`);
    reportRef.off('value');
    reportRef.on('value', (reportSnapshot: { val: () => Report }) => {
      this.report = reportSnapshot.val();
      if (!this.report) {
        this.router.navigate(['reports']);
        window.alert(`Report '${reportId}' not found!`);
      }

      const tests = this.report.tests;
      this.report.tests = {};

      const stopLoading = _.after(_.size(tests), () => this.loading = false);

      _.each(tests, (test, testId) => {
        const testRef = db.ref(`/tests/${testId}`);
        testRef.off('value');
        testRef.on('value', (testSnapshot: { val: () => Test }) => {
          // TODO: Fix report disappearing when a test value is updated
          stopLoading();
          const reportTest = this.report.tests[testId] = _.extend(testSnapshot.val(), test);
          this.updateLowAndHighPercents(reportTest);

          this.changeDetector.detectChanges();
        });
      });
    });
  }

  updateLowAndHighPercents(test: Test) {
    const valueRange = test.maxValue - test.minValue;

    if (test.value < test.minValue) {
      const lowPercent = 100 * (test.minValue - test.value) / valueRange;
      if (lowPercent > this.maxLowPercent) {
        this.maxLowPercent = lowPercent;
      }
    }

    if (test.value > test.maxValue) {
      const highPercent = 100 * (test.value - test.maxValue) / valueRange;
      if (highPercent > this.maxHighPercent) {
        this.maxHighPercent = highPercent;
      }
    }
  }


  /**
   * maxLowPercent = 10
   * maxHighPercent = 5
   * ----------|---5-----------------------------------------------------------------------------------------95---|-----
   *               ^ 100 * (10 + 5) / (100 + 10 + 5)                                                         ^ 100 * (10 + 95) / (100 + 10 + 5)
   * ----------0--------------------------------------------------------------------------------------------------100---
   *           ^ 100 * (10 + 0) / (100 + 10 + 5)                                                                  ^ 100 * (10 + 100) / (100 + 10 + 5)
   * ----5-----|--------------------------------------------------------------------------------------------------|101--
   *     ^ 100 * (10 - 5) / (100 + 10 + 5)                                                                         ^ 100 * (10 + 101) / (100 + 10 + 5)
   * 10--------|--------------------------------------------------------------------------------------------------|--105
   * ^ 100 * (10 - 10) / (100 + 10 + 5)                                                                              ^ 100 * (10 + 105) / (100 + 10 + 5)
   */
  getValuePercent(test: Test): number {
    const valuePercent = 100 * (test.value - test.minValue) / (test.maxValue - test.minValue);
    return 100 * (valuePercent + this.maxLowPercent) / (100 + this.maxLowPercent + this.maxHighPercent);
  }
}
