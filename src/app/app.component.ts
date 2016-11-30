import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  ngOnInit() {
    firebase.initializeApp({
      apiKey: 'AIzaSyC02fIaLDJ-hSSqEo7sufJZa5yuQXrlRzo',
      authDomain: 'lab-design.firebaseapp.com',
      databaseURL: 'https://lab-design.firebaseio.com',
      storageBucket: 'lab-design.appspot.com',
      messagingSenderId: '720237605264'
    });
  }
}
