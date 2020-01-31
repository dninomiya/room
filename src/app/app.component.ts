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

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private fb: FormBuilder
  ) {
    this.roomService.getLatestMessage().subscribe(messages => {
      const message = messages[0];
      if (!this.messages[message.uid]) {
        this.messages[message.uid] = [];
      }
      this.messages[message.uid].unshift(message.body);
      setTimeout(() => {
        this.messages[message.uid].pop();
      }, 5000);
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
}
