import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { User, GameOptions, Game, PlayerQnA, Question } from '../../../model';

export enum GamePlayActionTypes {
  RESET_NEW = '[GamePlay] ResetNew',
  CREATE_NEW = '[GamePlay] CreateNew',
  CREATE_NEW_SUCCESS = '[GamePlay] CreateNewSuccess',
  LOAD_GAME = '[GamePlay] LoadGame',
  LOAD_SUCCESS = '[GamePlay] LoadSuccess',
  RESET_CURRENT = '[GamePlay] ResetCurrent',
  GET_NEXT_QUESTION = '[GamePlay] GetNextQuestion',
  GET_NEXT_QUESTION_SUCCESS = '[GamePlay] GetNextQuestionSuccess',
  ADD_PLAYER_QNA = '[GamePlay] AddPlayerQnA',
  ADD_PLAYER_QNA_SUCCESS = '[GamePlay] AddPlayerQnASuccess',
  SET_GAME_OVER = '[GamePlay] SetGameOver',
  RESET_CURRENT_QUESTION = '[GamePlay] ResetCurrentQuestion',
}

export class ResetNewGame implements Action {
  readonly type = GamePlayActionTypes.RESET_NEW;
  payload = null;
}

export class CreateNewGame implements Action {
  readonly type = GamePlayActionTypes.CREATE_NEW;
  constructor(public payload: { gameOptions: GameOptions, user: User }) { }
}

export class CreateNewGameSuccess implements Action {
  readonly type = GamePlayActionTypes.CREATE_NEW_SUCCESS;
  constructor(public payload: string) { } //gameId
}


export class LoadGame implements Action {
  readonly type = GamePlayActionTypes.LOAD_GAME;
  constructor(public payload: Game) { } //game
}

export class LoadGameSuccess implements Action {
  readonly type = GamePlayActionTypes.LOAD_SUCCESS;
  constructor(public payload: Game) { } //game
}

export class ResetCurrentGame implements Action {
  readonly type = GamePlayActionTypes.RESET_CURRENT;
  payload = null;
}

export class GetNextQuestion implements Action {
  readonly type = GamePlayActionTypes.GET_NEXT_QUESTION;
  constructor(public payload: Game) { } //game - change in type for reducer
}

export class GetNextQuestionSuccess implements Action {
  readonly type = GamePlayActionTypes.GET_NEXT_QUESTION_SUCCESS;
  constructor(public payload: Question) { } //question
}

export class AddPlayerQnA implements Action {
  readonly type = GamePlayActionTypes.ADD_PLAYER_QNA;
  constructor(public payload: { game: Game, playerQnA: PlayerQnA }) { }
}

export class AddPlayerQnASuccess implements Action {
  readonly type = GamePlayActionTypes.ADD_PLAYER_QNA_SUCCESS;
  payload = null;
}

export class SetGameOver implements Action {
  readonly type = GamePlayActionTypes.SET_GAME_OVER;
  constructor(public payload: { game: Game, user: User }) { }
}

export class ResetCurrentQuestion implements Action {
  readonly type = GamePlayActionTypes.RESET_CURRENT_QUESTION;
  payload = null;
}

export type GamePlayActions
  = ResetNewGame
  | CreateNewGame
  | CreateNewGameSuccess
  | LoadGameSuccess
  | ResetCurrentGame
  | GetNextQuestion
  | GetNextQuestionSuccess
  | AddPlayerQnA
  | AddPlayerQnASuccess
  | SetGameOver
  | ResetCurrentQuestion;
