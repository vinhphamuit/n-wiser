import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ActionWithPayload, UserActions } from '../actions';
import { User } from '../../../model';
import { UserService } from '../../services'

@Injectable()
export class UserEffects {

    @Effect()
    loadUserRoles$ = this.actions$
        .ofType(UserActions.LOGIN_SUCCESS)
        .map((action: ActionWithPayload<User>) => action.payload)
        .switchMap((user: User) => this.svc.getUserRoles(user))
        .map((user: User) => this.userActions.addUserWithRoles(user));


    constructor(
        private actions$: Actions,
        private userActions: UserActions,
        private svc: UserService
    ) { }
}
