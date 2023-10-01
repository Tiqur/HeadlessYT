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
  url!: string;
  socket!: WebSocket;
  seconds_since_last_heartbeat: number = 0;
  heartbeat_interval!: number;

  // Create WebSocket and connect to URL 
  connect() {
    console.log("HeadlessYT");
    this.socket = new WebSocket(this.url);
    this.register_events();
  }

  set_url(url: string) {
    this.url = url;
  }

  register_events() {
    // Listen for message events
    this.socket.addEventListener('open', () => this.on_open());
    this.socket.addEventListener('message', this.on_message);
  }

  register_heartbeat_reciever()  {
    console.log("Registering heartbeat handler");

    this.heartbeat_interval = setInterval(async () => {
      // Increment
      this.seconds_since_last_heartbeat++;
      console.log(`Seconds since last heartbeat: ${this.seconds_since_last_heartbeat}`);

      // If last ping was > 10 seconds ago, close connection and try to reconnect
      if (this.seconds_since_last_heartbeat > 10) {
        this.seconds_since_last_heartbeat = 0;

        // If socket still open, close it
        console.log("Disconnecting...");
        this.socket.close();

        // Clear interval
        clearInterval(this.heartbeat_interval);

        // Try to connect again
        console.log("Attempting to reconnect...");
        this.connect();
      }
    }, 1000)
  }

  handle_ping() {
    this.seconds_since_last_heartbeat = 0;
  }

  handle_command(command: string) {
    switch (command) {
      // Stateless
      case "pause-play":
        send_keycode(32);
        break;
      case "mute":
        send_keycode(77);
        break;
      case "volume_up":
        send_keycode(38);
        break;
      case "volume_down":
        send_keycode(40);
        break;
      case "next_video":
        send_keycode(78, true);
        break;
      case "prev_video":
        send_keycode(80, true);
        break;


      // Stateful
      case "enable_shuffle":
        //document.querySelector('[aria-label="Shuffle playlist"]');
        break;
      case "disable_shuffle":
        //document.querySelector('[aria-label="Shuffle playlist"]');
        break;
      case "loop_video":
        //document.querySelector('[aria-label="Loop playlist"], [aria-label="Loop video"], [aria-label="Turn off loop"]');
        break;
      case "loop_playlist":
        //document.querySelector('[aria-label="Loop playlist"], [aria-label="Loop video"], [aria-label="Turn off loop"]');
        break;
      case "disable_loop":
        //document.querySelector('[aria-label="Loop playlist"], [aria-label="Loop video"], [aria-label="Turn off loop"]');
        break;
    }
  }

  on_message(event: MessageEvent) {
    const message = event.data;

    if (message == 'ping') {
      this.handle_ping();
    } else {
      this.handle_command(message);
    }
  }

  on_open() {
    console.log('[ HeadlessYT ]: Connected to server.');
    this.register_heartbeat_reciever();
  }
}

function send_keycode(keyCode: number, shiftKey: boolean = false) {
  document.getElementById('movie_player')?.dispatchEvent(new KeyboardEvent('keydown', { keyCode, shiftKey }));
}


(function() {
    'use strict';
    const hyt = new HeadlessYT();
    hyt.set_url('ws://localhost:3000')
    hyt.connect();
})();
