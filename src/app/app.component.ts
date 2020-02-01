import { Message } from './interfaces/message';
import { RoomService } from './services/room.service';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { tap, skip } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  messages = {};
  lightStatus$ = this.roomService.lightStatus$.pipe(
    tap(status => this.lightStatus = status)
  );
  lightStatus: boolean;
  users$ = this.roomService.getUsers();
  user$ = this.authService.user$;
  form = this.fb.group({
    body: ['', Validators.required]
  });
  playerVars = {
    controls: 0
  };
  id = 'qDuKsiwS5xw';
  player: YT.Player;
  youtubeForm = this.fb.group({
    url: ['', Validators.required]
  });

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private fb: FormBuilder
  ) {
    this.roomService.getLatestMessage().pipe(skip(1)).subscribe(messages => {
      const message = messages[0];
      if (!this.messages[message.uid]) {
        this.messages[message.uid] = [];
      }
      this.messages[message.uid].unshift(message.body);
      setTimeout(() => {
        this.messages[message.uid].pop();
      }, 5000);
    });

    this.roomService.videoId$.subscribe(videoId => {
      if (this.player) {
        this.player.loadVideoById(videoId);
      }
    });
  }

  login() {
    this.authService.login();
  }

  logout(uid: string) {
    this.authService.logout(uid);
  }

  toggleLight() {
    this.roomService.toggleLight(this.lightStatus);
  }

  sendMessage(uid: string) {
    this.roomService.sendMessage(
      uid,
      this.form.value.body
    );
    this.form.reset();
  }

  savePlayer(player) {
    this.player = player;
    this.player.playVideo();
    this.player.mute();
  }

  changeVideo() {
    if (this.youtubeForm.valid) {
      this.roomService.changeVideo(this.youtubeForm.value.url);
    }
  }
}
