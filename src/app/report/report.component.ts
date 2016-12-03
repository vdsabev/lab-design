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

  lowestValueCoefficient = 0;
  highestValueCoefficient = 0;

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
          this.updateCoefficients(reportTest);

          this.changeDetector.detectChanges();
        });
      });
    });
  }

  updateCoefficients(test: Test) {
    const valueRange = test.maxValue - test.minValue;

    if (test.value < test.minValue) {
      const lowCoefficient = (test.minValue - test.value) / valueRange;
      if (lowCoefficient > this.lowestValueCoefficient) {
        this.lowestValueCoefficient = lowCoefficient;
      }
    }

    if (test.value > test.maxValue) {
      const highCoefficient = (test.value - test.maxValue) / valueRange;
      if (highCoefficient > this.highestValueCoefficient) {
        this.highestValueCoefficient = highCoefficient;
      }
    }
  }

  getValuePosition(value: number, test: Test): number {
    const valueRange = test.maxValue - test.minValue;
    const maxLowValue = test.minValue - valueRange * this.lowestValueCoefficient;
    const maxHighValue = test.maxValue + valueRange * this.highestValueCoefficient;
    return 100 * (value - maxLowValue) / (maxHighValue - maxLowValue);
  }
}
