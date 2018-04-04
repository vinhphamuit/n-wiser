import { Component, Inject, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import '../../../rxjs-extensions';

import * as gameplayactions from '../../store/actions';
import { categoryDictionary } from '../../../store';
import { gameplayState, GamePlayState } from '../../store';

import { GameQuestionComponent } from '../game-question/game-question.component';
import { GameActions } from '../../../core/store/actions';
import { Utils } from '../../../core/services';
import {
  Game, GameOptions, GameMode, PlayerQnA,
  User, Question, Category, GameStatus,
  PlayerMode, OpponentType
} from '../../../model';

@Component({
  selector: 'game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss']
})
export class GameDialogComponent implements OnInit, OnDestroy {
  private _gameId: string;
  user: User;
  gameObs: Observable<Game>;
  game: Game;
  gameQuestionObs: Observable<Question>;
  currentQuestion: Question;
  correctAnswerCount: number;
  questionIndex: number;
  sub: Subscription[] = [];
  timerSub: Subscription;
  timer: number;
  categoryDictionary: { [key: number]: Category }
  categoryName: string;
  continueNext = false;
  gameOver = false;
  turnStatus = false;
  MAX_TIME_IN_SECONDS = 16;
  showContinueBtn = false;


  @ViewChild(GameQuestionComponent)
  private questionComponent: GameQuestionComponent;

  constructor(private store: Store<GamePlayState>, private gameActions: GameActions, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this._gameId = data.gameId;
    this.user = data.user;


    this.questionIndex = 0;
    this.correctAnswerCount = 0;
    this.gameObs = store.select(gameplayState).select(s => s.currentGame).filter(g => g != null);
    this.gameQuestionObs = store.select(gameplayState).select(s => s.currentGameQuestion);


    this.store.select(categoryDictionary).take(1).subscribe(c => { this.categoryDictionary = c });
    this.sub.push(
      this.gameObs.subscribe(game => {
        this.game = game;
        this.questionIndex = this.game.playerQnAs.filter((p) => p.playerId === this.user.userId).length;
        this.correctAnswerCount = this.game.playerQnAs.filter((p) => p.answerCorrect && p.playerId === this.user.userId).length;
        this.setTurnStatusFlag();
      }));

    this.sub.push(
      this.gameQuestionObs.subscribe(question => {
        if (!question) {
          this.currentQuestion = null;
          return;
        }
        this.currentQuestion = question;
        this.questionIndex++;
        this.categoryName = this.categoryDictionary[question.categoryIds[0]].categoryName
        this.timer = this.MAX_TIME_IN_SECONDS;

        this.timerSub =
          Observable.timer(1000, 1000).take(this.timer).subscribe(t => {
            this.timer--;
          },
            null,
            () => {
              // console.log("Time Expired");
              //disable all buttons
              (!this.turnStatus) ?
                this.afterAnswer() : '';

            });

      })
    );
  }

  ngOnInit() {

  }

  setTurnStatusFlag() {
    const turnFlag = (this.game.GameStatus === GameStatus.STARTED ||
      (this.game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q && this.game.nextTurnPlayerId === this.user.userId)) ? false : true;
    if (!turnFlag) {
      this.turnStatus = turnFlag;
      if (!this.currentQuestion) {
        this.getNextQuestion();
      }
      this.showContinueBtn = true;
    } else {
      this.showContinueBtn = false;
      Observable.timer(5000).take(1).subscribe(t => {
        this.turnStatus = turnFlag;
        this.store.dispatch(new gameplayactions.LoadGame(this.game));
        this.currentQuestion = undefined;
        this.continueNext = false;
        this.router.navigate(['/dashboard']);
      });
      Utils.unsubscribe([this.timerSub]);
    }


  }

  getNextQuestion() {
    this.store.dispatch(new gameplayactions.GetNextQuestion(this.game));
  }

  answerClicked($event: number) {
    //console.log($event);
    Utils.unsubscribe([this.timerSub]);
    //disable all buttons
    this.afterAnswer($event);
  }
  okClick($event) {
    if (this.questionIndex >= this.game.gameOptions.maxQuestions)
      this.gameOver = true;
    else
      this.continueNext = true;
  }

  continueClicked($event) {
    this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
    this.continueNext = false;
    if (Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent
      && Number(this.game.gameOptions.opponentType) === OpponentType.Random) {
      if (this.correctAnswerCount >= 3) {
        this.gameOver = true;
      }
    } else if (this.questionIndex >= this.game.gameOptions.maxQuestions) {
      //game over
      this.gameOver = true;
      return;
    }
    (!this.gameOver) ?
      this.getNextQuestion() : '';
  }

  /*
  viewQuestionClicked($event) 
  {
    if (this.continueNext)
      this.continueNext = false;
    if (this.gameOver)
      this.gameOver = false;
  }
  */
  gameOverContinueClicked() {
    //this.router.navigate(['/']);
  }
  afterAnswer(userAnswerId?: number) {

    let correctAnswerId = this.currentQuestion.answers.findIndex(a => a.correct);
    //console.log(correctAnswerId);
    if (userAnswerId === correctAnswerId)
      this.correctAnswerCount++;
    let seconds = this.MAX_TIME_IN_SECONDS - this.timer;
    let playerQnA: PlayerQnA = {
      playerId: this.user.userId,
      playerAnswerId: isNaN(userAnswerId) ? null : userAnswerId.toString(),
      playerAnswerInSeconds: seconds,
      answerCorrect: (userAnswerId === correctAnswerId),
      questionId: this.currentQuestion.id
    }
    //console.log(playerQnA);

    if (Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent
      && Number(this.game.gameOptions.opponentType) === OpponentType.Random) {
      if (this.game.GameStatus === GameStatus.STARTED && !playerQnA.answerCorrect) {
        this.game.nextTurnPlayerId = '';
        this.game.GameStatus = GameStatus.WAITING_FOR_NEXT_Q;
      } else if (!playerQnA.answerCorrect) {
        this.game.nextTurnPlayerId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
      } else {
        this.game.nextTurnPlayerId = this.user.userId;
      }
    }

    this.game.turnAt = new Date().getTime();

    //dispatch action to push player answer
    this.store.dispatch(new gameplayactions.AddPlayerQnA({ "game": this.game, "playerQnA": playerQnA }));

    if (Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent
      && Number(this.game.gameOptions.opponentType) === OpponentType.Random
    ) {
      if (this.game.playerQnAs.filter((p) => p.answerCorrect && p.playerId === this.user.userId).length >= 3) {
        this.game.winnerPlayerId = this.user.userId;
        this.store.dispatch(new gameplayactions.SetGameOver({ "game": this.game, "user": this.user }));
      }
    } else if (this.questionIndex >= this.game.gameOptions.maxQuestions) {
      //game over
      this.store.dispatch(new gameplayactions.SetGameOver({ "game": this.game, "user": this.user }));
    }

    this.questionComponent.disableQuestions(correctAnswerId);

    Observable.timer(500).take(1).subscribe(t => {
      this.continueNext = true;
    });


  }

  ngOnDestroy() {
    Utils.unsubscribe([this.timerSub]);
    Utils.unsubscribe(this.sub);
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
  }
}
