import {GameOptions} from './game-options';
import {Question} from './question';

export class PlayerQnA {
  playerId: string;
  questionId: string;
  playerAnswerId?: string;
  playerAnswerInSeconds?: number;
  answerCorrect?: boolean;
}
export class Game {
  private _gameId?: string;
  private _gameOptions: GameOptions
  private _playerIds: string[];
  public gameOver: boolean;
  public playerQnAs: PlayerQnA[];
  public nextTurnPlayerId: string;

  constructor(gameOptions: GameOptions, player1UUId: string, gameId?: string, playerQnAs?: any, gameOver?: boolean, nextTurnPlayerId?: string) {
    //defaults
    this._gameOptions = gameOptions;
    this._playerIds = [player1UUId];
    this.nextTurnPlayerId = nextTurnPlayerId ? nextTurnPlayerId : player1UUId;
    this.gameOver = (gameOver) ? true : false;
    this.playerQnAs = [];
    if (playerQnAs)
    {
      let key: string;
      for (key of Object.keys(playerQnAs))
      {
        let qna = playerQnAs[key];
        this.playerQnAs.push({
          "playerId": qna.playerId,
          "questionId": qna.questionId,
          "playerAnswerId": qna.playerAnswerId,
          "playerAnswerInSeconds": qna.playerAnswerInSeconds,
          "answerCorrect": qna.answerCorrect
        });
      }
    }
    if (gameId)
      this._gameId = gameId;
  }

  addPlayer(playerUUId: string) {
    this._playerIds.push(playerUUId);
  }

  get gameOptions(): GameOptions {
    return this._gameOptions;
  }
  get playerIds(): string[] {
    return this._playerIds;
  }
  get gameId(): string {
    return this._gameId;
  }

  addPlayerQnA(playerId: string, questionId: string): PlayerQnA 
  {
    let playerQnA: PlayerQnA = {
      "playerId": playerId,
      "questionId": questionId
    }
    this.playerQnAs.push(playerQnA);
    return playerQnA;
  }

  updatePlayerQnA(playerId: string, questionId: string, 
                  playerAnswerId: string, playerAnswerInSeconds: number, answerCorrect: boolean): PlayerQnA 
  {
    let playerQnA: PlayerQnA = this.playerQnAs.find(p => p.playerId === playerId && questionId === questionId);
    playerQnA.playerAnswerId = playerAnswerId;
    playerQnA.answerCorrect = answerCorrect;
    playerQnA.playerAnswerInSeconds = playerAnswerInSeconds;
    return playerQnA;
  }

  getDbModel(): any 
  {
    let dbModel = {
      "gameOptions": Object.assign({}, this.gameOptions),
      "playerIds": this.playerIds,
      "gameOver": false,
      "playerQnAs": this.playerQnAs
    }
    for (let i = 0; i < this.playerIds.length; i ++) {
      dbModel["playerId_" + i] = this.playerIds[i];
    }
    return dbModel;
  }

  static getViewModel(dbModel: any): Game 
  {
    //console.log(dbModel);
    let game: Game = new Game(dbModel["gameOptions"], dbModel["playerIds"][0], dbModel["id"], 
                              dbModel["playerQnAs"], dbModel["gameOver"], dbModel["nextTurnPlayerId"]);
    if (dbModel["playerIds"].length > 1) {
      game.addPlayer(dbModel["playerIds"][1]);  //2 players
    }
    //console.log(game);
    return game;
  }

}
