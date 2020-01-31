import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = this.afAuth.user;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) { }

  login() {
    this.afAuth.auth.signInAnonymously().then(result => {
      this.db.doc(`users/${result.user.uid}`).set({
        uid: result.user.uid,
        leftPosition: Math.floor(Math.random() * 800) + 'px',
        avatarId: Math.floor(Math.random() * 10) + 1,
      });
    });

  }

  logout(uid: string) {
    this.db.doc(`users/${uid}`).delete();
    this.afAuth.auth.signOut();
  }
}
