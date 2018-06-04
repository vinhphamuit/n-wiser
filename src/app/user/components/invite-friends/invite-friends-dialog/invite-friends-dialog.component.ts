import { Component, OnInit, Renderer2 } from '@angular/core';
import { User } from '../../../../model';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../../store';

@Component({
  selector: 'app-invite-friends-dialog',
  templateUrl: './invite-friends-dialog.component.html',
  styleUrls: ['./invite-friends-dialog.component.scss']
})
export class InviteFriendsDialogComponent implements OnInit {

  user: User;
  navLinks = [];
  ref: any;

  constructor(private store: Store<AppState>, private renderer: Renderer2) {
    this.store.select(appState.coreState).take(1).subscribe(s => this.user = s.user);

  }

  ngOnInit() {

  }

  closeModel() {
    this.ref.close();
  }
}
