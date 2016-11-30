import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FlexDirective } from './flex';
import { ReportComponent } from './report';
import { ReportsComponent } from './reports';
import { TimeagoPipe, TimeagoImpurePipe } from './timeago';
import { ToArrayPipe } from './to-array';

@NgModule({
  declarations: [
    AppComponent,
    FlexDirective,
    ReportComponent,
    ReportsComponent,
    TimeagoPipe,
    TimeagoImpurePipe,
    ToArrayPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: '/reports' },
      {
        path: 'reports',
        children: [
          { path: '', component: ReportsComponent },
          { path: ':id', component: ReportComponent }
        ]
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
