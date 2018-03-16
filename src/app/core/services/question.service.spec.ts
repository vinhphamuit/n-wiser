import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';

import { MockStore, TEST_DATA } from '../../testing';
import { QuestionActions } from '../../core/store/actions';
import { Question } from '../../model';
import { QuestionService } from './question.service';

describe('Service: QuestionService', () => {
  let questionList: Question[] = [...TEST_DATA.questions.published, ...TEST_DATA.questions.published, ...TEST_DATA.questions.published];
  let MAX_SAMPLE_Qs_COUNT = 4;
  let afDbMock = { 
                     "list": () => Observable.of(questionList),
                     "object": () => null
                  };

  //Define intial state and test state
  let _initialState = {};

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      QuestionService, QuestionActions,
      { "provide": Store, "useValue": new MockStore(_initialState) },
      { "provide": AngularFireDatabase, "useValue": afDbMock }
    ]
  })
  
  );

  it('Call getQuestions to return Observable of Questions',
    inject([
      QuestionService
    ],
    (service: QuestionService) => {

      let qObs = service.getQuestions();

      qObs.subscribe(questions => {
        expect(questions.length).toEqual(questionList.length);
        expect(questions[0]).toEqual(questionList[0]);
      });

    })
  );

  it('Call getUnpublishedQuestions to return Observable of Questions',
    inject([
      QuestionService
    ],
    (service: QuestionService) => {

      let qObs = service.getUnpublishedQuestions();

      qObs.subscribe(questions => {
        expect(questions.length).toEqual(questionList.length);
        expect(questions[0]).toEqual(questionList[0]);
      });

    })
  );

  it('Call getSampleQuestions to return Observable of sample questions', 
    inject([
      QuestionService, AngularFireDatabase
    ],
    (service: QuestionService, db: AngularFireDatabase) => {

      spyOn(db, 'list')
          .and.returnValue(Observable.of(questionList.slice(0, 4)));
      let qObs = service.getSampleQuestions();

      qObs.subscribe(questions => {
        expect(questions.length).toBeLessThanOrEqual(MAX_SAMPLE_Qs_COUNT);
      });
    })
  );

  it('Call getUserQuestions to return Observable of Questions',
    inject([
      QuestionService, AngularFireDatabase
    ],
    (service: QuestionService, db: AngularFireDatabase) => {

      let qids = TEST_DATA.questions.published.map(q => q.id);
      spyOn(db, 'list')
          .and.returnValue(Observable.of(qids));
      spyOn(db, 'object')
          .and.returnValue(Observable.of(TEST_DATA.questions.published[0]));
      
      let qObs = service.getUserQuestions(TEST_DATA.userList[0]);

      qObs.subscribe(questions => {
        expect(questions.length).toEqual(TEST_DATA.questions.published.length);
        expect(questions[0].id).toEqual(TEST_DATA.questions.published[0].id);
      });
    })
  );

  it('Call saveQuestion to save a question',
    inject([
      QuestionService, AngularFireDatabase
    ],
    (service: QuestionService, db: AngularFireDatabase) => {

      let question = TEST_DATA.questions.published[0];
      spyOn(db, 'list')
          .and.returnValue({ "push": () => Promise.resolve(question) });
      
      let qObs = service.saveQuestion(TEST_DATA.questions.published[0]);
      expect(db.list).toHaveBeenCalled();
    })
  );

  it('Call approveQuestion to save a question',
    inject([
      QuestionService, AngularFireDatabase
    ],
    (service: QuestionService, db: AngularFireDatabase) => {

      let question = TEST_DATA.questions.published[0];
      spyOn(db, 'object')
          .and.returnValue({ "update": () => Promise.resolve(question),
                             "remove": () => null });
      
      let qObs = service.approveQuestion(TEST_DATA.questions.published[0]);
      expect(db.object).toHaveBeenCalled();
    })
  );

});
