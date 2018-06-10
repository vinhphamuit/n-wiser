import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-store';
import { User, Invitation, Friends } from '../../model';
import { ObservableInput } from 'rxjs/Observable';
import { CONFIG } from '../../../environments/environment';
import { UserActions } from '../../core/store/actions';
import * as useractions from '../../user/store/actions';



@Injectable()
export class UserService {

    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private http: HttpClient,
        private store: Store<AppState>, private userActions: UserActions) {
    }


    loadUserProfile(user: User): Observable<User> {

        return this.db.doc<any>(`/users/${user.userId}`).valueChanges()
            .map(u => {
                if (u) {
                    user = { ...u, ...user };
                    if (u.stats) {
                        user.stats = u.stats;
                    }
                } else {
                    this.saveUserProfile(user);
                }

                return user;
            })
            .mergeMap(u => this.getUserProfileImage(u));
    }

    saveUserProfile(user: User) {
        user.roles = (!user.roles) ? {} : user.roles;
        const dbUser = Object.assign({}, user); // object to be saved
        delete dbUser.authState;
        delete dbUser.profilePictureUrl;
        this.db.doc(`/users/${dbUser.userId}`).set(dbUser).then(ref => {
            // this.store.dispatch(this.userActions.addUserProfileSuccess());
            this.store.dispatch(new useractions.AddUserProfileSuccess());
        });
    }


    loadOtherUserProfile(userId: string): Observable<User> {
        const url = `${CONFIG.functionsUrl}/app/user/${userId}`;
        return this.http.get<User>(url).mergeMap(u => this.getUserProfileImage(u));
    }


    getUserProfileImage(user: User): Observable<User> {
        if (user.profilePicture && user.profilePicture !== '') {
            const filePath = `profile/${user.userId}/avatar/${user.profilePicture}`;
            const ref = this.storage.ref(filePath);
            return ref.getDownloadURL().map(url => {
                user.profilePictureUrl = (url) ? url : '/assets/images/default-avatar.png';
                return user;
            });
        } else {
            user.profilePictureUrl = '/assets/images/default-avatar.png'
            return Observable.of(user);
        }
    }

    setSubscriptionFlag(userId: string) {
        this.db.doc(`/users/${userId}`).update({ isSubscribed: true });
    }

    saveUserInvitations(obj: any): Observable<boolean> {
        const invitation = new Invitation();
        invitation.created_uid = obj.created_uid;
        invitation.status = obj.status;
        const email = this.db.firestore.batch();
        obj.emails.map((element) => {
            invitation.email = element;
            const dbInvitation = Object.assign({}, invitation); // object to be saved
            const id = this.db.createId();
            dbInvitation.id = id;
            email.set(this.db.firestore.collection('invitations').doc(dbInvitation.id), dbInvitation);
        });
        email.commit();
        return Observable.of(true);
    }

    checkInvitationToken(obj: any): Observable<any> {
        const url = `${CONFIG.functionsUrl}/app/friend`;
        return this.http.post<any>(url, obj);
    }

    loadUserFriends(userId: string): Observable<Friends> {
        return this.db.doc<Friends>(`/friends/${userId}`).valueChanges();
    }
}
