// ==UserScript==
// @name         HeadlessYT
// @version      0.1
// @description  A simple script to expose an API for the youtube media player.
// @author       TrevorBrage
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

class HeadlessYT {
  socket!: WebSocket;

  // Create WebSocket and connect to URL 
  connect(url: string) {
    this.socket = new WebSocket(url);
    this.register_events();
  }

  register_events() {
    // Listen for message events
    this.socket.addEventListener('open', this.on_open);
    this.socket.addEventListener('message', this.on_message);
  }

  on_message(event: MessageEvent) {
    const command: string = event.data;
    console.log(command);

    switch (command) {
      case "pause-play":
        send_keycode(32);
        break;
    }
  }

  on_open() {
    console.log('[ HeadlessYT ]: Connected to server.')
  }
}

function send_keycode(keyCode: number) {
  document.dispatchEvent(new KeyboardEvent('keydown', { keyCode }))
}


(function() {
    'use strict';
    const hyt = new HeadlessYT();
    hyt.connect('ws://localhost:3000');
})();
