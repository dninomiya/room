import { Video } from './../interfaces/video';
import { Message } from './../interfaces/message';
import { Light } from './../interfaces/light';
import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  lightStatus$ = this.db.doc<Light>('room/light').valueChanges().pipe(
    map(data => data && data.status)
  );

  videoId$: Observable<string> = this.db.doc<Video>('room/video').valueChanges().pipe(
    map(data => data && data.id)
  );

  constructor(
    private db: AngularFirestore
  ) { }

  getUsers(): Observable<User[]> {
    return this.db.collection<User>('users').valueChanges();
  }

  toggleLight(status: boolean) {
    this.db.doc('room/light').set({
      status: !status
    });
  }

  sendMessage(uid: string, body: string) {
    const id = this.db.createId();
    this.db.doc(`messages/${id}`).set({
      id,
      uid,
      body,
      createdAt: new Date()
    });
  }

  deleteMessage(id: string) {
    this.db.doc(`messages/${id}`).delete();
  }

  getLatestMessage(): Observable<Message[]> {
    return this.db.collection<Message>('messages', ref => ref.orderBy('createdAt', 'desc').limit(1)).valueChanges();
  }

  changeVideo(url: string) {
    const matcher = url.match(/https:\/\/www\.youtube\.com\/watch\?v=(.+)/);

    if (matcher) {
      const id = matcher[1];
      console.log(id);
      this.db.doc('room/video').set({
        id
      });
    } else {
      console.log('URLが不正です');
      return null;
    }
  }
}
