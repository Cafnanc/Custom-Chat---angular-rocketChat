import { Component, VERSION, AfterViewChecked, ElementRef, ViewChild, OnInit } from "@angular/core";

import {STATUSES, Message} from './models'
import {USERS, RANDOM_MSGS, getRandom} from './data'
import axios from "axios"

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  constructor() {}

  statuses = STATUSES;
  activeUser: any;
  users = USERS;
  expandStatuses = false;
  expanded = false;
  messageReceivedFrom = {
    img: 'https://cdn.livechat-files.com/api/file/lc/img/12385611/371bd45053f1a25d780d4908bde6b6ef',
    name: 'Media bot'
  }

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    async ngOnInit() { 
      this.setUserActive(USERS[0])
      this.scrollToBottom();
      console.log("ngoninit")
      this.login()
    }

    async login() {
      console.log('login')
      // try {
        const url = '/api/v1/login';
        let data = await this.post(url, { username: 'joffinjoy', password: 'qXN5tYzXTNYgqHj' });
        console.log(data)
      // } catch (err) {
      //   console.log(err);
      //   return err
      // }
    };

        ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    async post(url: any, data: any) {
      console.log("post")
      // try {
        url = 'https://chat-dev.elevate-apis.shikshalokam.org' + url;
        const response:any = await axios.post(url, data);
        console.log(response)
        // return {
        //   success: true,
        //   status: response.status,
        //   data: response.data,
        // };
      // } catch (err: any) {
      //   console.log(err)
      //   if (err.response) {
      //     return {
      //       success: false,
      //       status: err.response.status,
      //       error: err.response.data,
      //     };
      //   } else if (err.request) {
      //   } else {
      //   }
      //   return {
      //     success: false,
      //     error: 'An unexpected error occurred.',
      //   };
      // }
    };

  addNewMessage(inputField: any) {
    const val = inputField.value?.trim()
    if (val.length) {
      this.activeUser.messages.push({type: 'sent', message: val, time: Date.now().toLocaleString})
      this.activeUser.ws.send(
        JSON.stringify({id: this.activeUser.id, message: val})
        );
    }
    inputField.value = '';
  }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

    setUserActive(user: any) {
      this.activeUser = user;
      this.connectToWS();
    }

    connectToWS() {
      console.log(this.activeUser.ws)
      if (this.activeUser.ws && this.activeUser.ws.readyState !== 1) {
        this.activeUser.ws = null;
        this.activeUser.status = STATUSES.OFFLINE;
      }
      if (this.activeUser.ws) {
        return;
      }
      const ws = new WebSocket('wss://chat-dev.elevate-apis.shikshalokam.org/sockjs/741/03d14gew/websocket');
      this.activeUser.ws = ws;
      ws.onopen = (event) => this.onWSEvent(event, STATUSES.ONLINE);
      ws.onclose = (event) => this.onWSEvent(event, STATUSES.OFFLINE);
      ws.onerror = (event) => this.onWSEvent(event, STATUSES.OFFLINE);
      ws.onmessage = (result: any) => {
        console.log(result)
        const data = JSON.parse(result?.data || {});
        const userFound = this.users.find(u => u.id === data.id);
        if (userFound) {
          userFound.messages.push(
             new Message('replies', data.message, Date.now().toLocaleString())
          )
        }
      };
    }

    onWSEvent(event: any, status: STATUSES) {
      this.users.forEach(u => u.ws === event.target ? u.status = status : null)
    }

    moreOptions(event:any) {
      //show popup
      console.log("Implement popup")
    }
}
