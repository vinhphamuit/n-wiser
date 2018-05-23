import { Component, Input, Output, OnInit, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { BulkUploadFileInfo, Question, Category } from '../../../../model';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource } from '@angular/material';
import { Utils } from '../../../../core/services';
import { AngularFireStorage } from 'angularfire2/storage';


import { MatSnackBar } from '@angular/material';
import { AppState, appState, categoryDictionary } from '../../../../store';
import { bulkState } from '../../../store';
import * as bulkActions from '../../../store/actions';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';

@Component({
  selector: 'app-bulk-summary-questions',
  templateUrl: './bulk-summary-question.component.html',
  styleUrls: ['./bulk-summary-question.component.scss']
})
export class BulkSummaryQuestionComponent implements OnInit, OnChanges {

  unPublishedQuestions: Question[];
  publishedQuestions: Question[];
  publishedCount: number;
  unPublishedCount: number;
  unPublishedQuestionObs: Observable<Question[]>;
  publishedQuestionObs: Observable<Question[]>;

  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  fileInfoDS: MatTableDataSource<BulkUploadFileInfo>;

  PUBLISHED_SHOW_BUTTON_STATE = false;
  UNPUBLISHED_SHOW_BUTTON_STATE = true;
  downloadUrl: Observable<string | null>;

  @Input() bulkUploadFileInfo: BulkUploadFileInfo;
  @Input() isAdminUrl: boolean;
  @Output() showSummaryTableReturn = new EventEmitter<boolean>();


  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage) {

    this.store.select(bulkState).select(s => s.questionSaveStatus).subscribe(status => {
      if (status === 'UPDATE') {
        this.snackBar.open('Question Updated!', '', { duration: 1500 });
      }
    });

    this.store.select(bulkState).select(s => s.bulkUploadFileUrl).subscribe((url) => {
      if (url) {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.href = url;
        link.click();
        this.store.dispatch(new bulkActions.LoadBulkUploadFileUrlSuccess(undefined));
      }
    });


  }

  ngOnInit() {
    this.categoryDictObs = this.store.select(categoryDictionary);
    this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bulkUploadFileInfo'].currentValue !== changes['bulkUploadFileInfo'].previousValue) {
      this.fileInfoDS = new MatTableDataSource<BulkUploadFileInfo>([this.bulkUploadFileInfo]);

      // get published question by BulkUpload Id
      this.publishedQuestionObs = this.store.select(bulkState).select(s => s.bulkUploadPublishedQuestions);
      this.store.dispatch(new bulkActions.LoadBulkUploadPublishedQuestions({ bulkUploadFileInfo: this.bulkUploadFileInfo }));
      this.publishedQuestionObs.subscribe((questions) => {
        if (questions) {
          this.publishedCount = questions.length;
          this.publishedQuestions = questions;
        }
      });

      // get unpublished question by BulkUpload Id
      this.unPublishedQuestionObs = this.store.select(bulkState).select(s => s.bulkUploadUnpublishedQuestions);
      this.store.dispatch(new bulkActions.LoadBulkUploadUnpublishedQuestions({ bulkUploadFileInfo: this.bulkUploadFileInfo }));
      this.unPublishedQuestionObs.subscribe((questions) => {
        if (questions) {
          this.unPublishedCount = questions.length;
          this.unPublishedQuestions = questions;
        }
      });

    }
  }


  backToSummary() {
    this.showSummaryTableReturn.emit(true);
  }

  downloadFile() {
    this.store.dispatch(new bulkActions.LoadBulkUploadFileUrl({ bulkUploadFileInfo: this.bulkUploadFileInfo }));
  }


}


