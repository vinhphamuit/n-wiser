import { Component } from '@angular/core';
<<<<<<< HEAD

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
=======
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
>>>>>>> upstream/master

@Component({
  selector: 'app-bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss']
})
<<<<<<< HEAD
export class BulkSummaryComponent {

  public bulkSummaryDetailPath = '/';

  constructor() { }

=======
export class BulkSummaryComponent implements OnInit {

  public bulkSummaryDetailPath = '/';
  public bulkSummaryTitle: string;
  public showSummaryTable = true;


  constructor() { }

  ngOnInit() {
    this.setDefaultTitle();
  }

  changeTableHeading(heading: string): void {
    if (heading) {
      this.bulkSummaryTitle = heading;
      this.showSummaryTable = false;
    }
  }

  setDefaultTitle(): void {
    this.bulkSummaryTitle = 'My Bulk Upload Summary';
  }

  backToSummary(): void {
    this.showSummaryTable = true;
    this.setDefaultTitle();
  }


>>>>>>> upstream/master
}
