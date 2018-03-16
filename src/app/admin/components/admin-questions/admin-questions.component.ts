import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { PageEvent } from '@angular/material';
import { AppState, appState, categoryDictionary } from '../../../store/app-store';
import { User, Question, Category, SearchResults, SearchCriteria } from '../../../model';

import { adminState } from '../../store';
import * as adminActions from '../../store/actions';

@Component({
  selector: 'admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.scss']
})

export class AdminQuestionsComponent implements OnInit {
  questionsSearchResultsObs: Observable<SearchResults>;
  unpublishedQuestionsObs: Observable<Question[]>;
  categoryDictObs: Observable<{ [key: number]: Category }>;
  criteria: SearchCriteria;

  constructor(private store: Store<AppState>) {

    this.questionsSearchResultsObs = this.store.select(adminState).select(s => s.questionsSearchResults);
    this.unpublishedQuestionsObs = store.select(adminState).select(s => s.unpublishedQuestions);

    this.categoryDictObs = store.select(categoryDictionary);
    this.criteria = new SearchCriteria();
  }

  ngOnInit() {

  }

  approveQuestion(question: Question) {
    let user: User;

    this.store.select(appState.coreState).take(1).subscribe(s => user = s.user);
    question.approved_uid = user.userId;
    this.store.dispatch(new adminActions.LoadUnpublishedQuestions());
    this.store.dispatch(new adminActions.ApproveQuestion({ question: question }));
  }

  pageChanged(pageEvent: PageEvent) {
    const startRow = (pageEvent.pageIndex) * pageEvent.pageSize;

    this.store.dispatch(new adminActions.LoadQuestions({
      'startRow': startRow,
      'pageSize': pageEvent.pageSize, criteria: this.criteria
    }));
  }

  categoryChanged(event: { categoryId: number, added: boolean }) {
    if (!this.criteria.categoryIds) {
      this.criteria.categoryIds = [];
    }

    if (event.added) {
      this.criteria.categoryIds.push(event.categoryId);
    } else {
      this.criteria.categoryIds = this.criteria.categoryIds.filter(c => c !== event.categoryId);
    }

    this.searchCriteriaChange();
  }
  tagChanged(event: { tag: string, added: boolean }) {
    if (!this.criteria.tags) {
      this.criteria.tags = [];
    }

    if (event.added) {
      this.criteria.tags.push(event.tag);
    } else {
      this.criteria.tags = this.criteria.tags.filter(c => c !== event.tag);
    }

    this.searchCriteriaChange();
  }
  sortOrderChanged(sortOrder: string) {
    this.criteria.sortOrder = sortOrder;
    this.searchCriteriaChange();
  }
  searchCriteriaChange() {
    this.store.dispatch(new adminActions.LoadQuestions({ 'startRow': 0, 'pageSize': 25, criteria: this.criteria }));
  }
}
