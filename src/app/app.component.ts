import { Component, VERSION, AfterViewChecked, ElementRef, ViewChild, OnInit } from "@angular/core";

import { STATUSES, Message } from './models'
import { USERS, RANDOM_MSGS, getRandom } from './data'
import axios from "axios";
import { LocalStorageService } from "./localstorage.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  messagesArray: any;
  userId: any;
  currentDate: Date;
  constructor(private localStorage: LocalStorageService) { }

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
    this.userId = 'gGQMHdbEJ9WPqWwdf'
    //login
    // let data = await this.login({ username: 'joffinjoy', password: 'qXN5tYzXTNYgqHj' })
    // console.log(data)

    //setting local
    // let locStore = await this.localStorage.setLocalData("Meteor.loginToken", JSON.parse(data.data.message).result.token)
    // const date = new Date(JSON.parse(data.data.message).result.tokenExpires.$date * 1000);
    // const formattedDate = date.toString();
    // await this.localStorage.setLocalData("Meteor.loginTokenExpires", formattedDate)
    // await this.localStorage.setLocalData("Meteor.userId", JSON.parse(data.data.message).result.id)

    //getRoomRoles
    const headers = {
      'X-Auth-Token': "gfeA9xdHFt0Vf-jKh6aGk2IBrkbGHQ1xNducPSNy4HM",
      'X-User-Id': 'gGQMHdbEJ9WPqWwdf',
      // You can add more headers if needed
    };
    console.log(headers)

    let getRoomRoles = await this.getRoomRoles(headers);
    console.log("Room roles API: ",getRoomRoles)

    let getRoomByTypeAndName = await this.getRoomByTypeAndName(headers)
    console.log("Room bt type and name API: ",getRoomByTypeAndName)
    console.log(JSON.parse(getRoomByTypeAndName.data.message))

    let loadHistory = await this.loadHistory(headers)
    console.log("Load history API: ", loadHistory)
    console.log(JSON.parse(loadHistory.data.message))

    let userInfo = await this.userInfo(headers)
    console.log(userInfo)
  }

  async userInfo(headers: { 'X-Auth-Token': string; 'X-User-Id': string; }) {
    try {
      const url = '/api/v1/users.info?username=kiranharidas' ;
      let data = await this.get(
        url,
        headers
      );
      return data
    } catch (err) {
      console.log(err);
    }
  }
  async get(url: string, headers: { 'X-Auth-Token': string; 'X-User-Id': string; }) {
    console.log("get")
    url = 'https://chat-dev.elevate-apis.shikshalokam.org' + url;
    const response: any = await axios.get(url, { headers });
    return response
  }

  async loadHistory(headers: { 'X-Auth-Token': string; 'X-User-Id': string; }) {
    try {
      const url = '/api/v1/method.call/loadHistory' ;
      let data = await this.post(
        url,
        {
          message: JSON.stringify({"msg":"method","id":"100","method":"loadHistory","params":["YwisTMuma3efTJwc7gGQMHdbEJ9WPqWwdf",null,50,"Wed Apr 24 2024 11:20:24 GMT+0530 (India Standard Time)",false]})
        },
        headers
      );
      this.messagesArray = JSON.parse(data.data.message).result.messages.reverse();
      this.currentDate = new Date(this.messagesArray[0].ts.$date);
      return data
    } catch (err) {
      console.log(err);
    }
  }

  async getRoomRoles(headers: any) {
    let body = {
      "msg": "method",
      "id": "95",
      "method": "getRoomRoles",
      "params": [
        "YwisTMuma3efTJwc7gGQMHdbEJ9WPqWwdf"
      ]
    }
    let data = await this.post('/api/v1/method.call/getRoomRoles', { message: JSON.stringify(body) }, headers)
    return data
  }

  getRoomByTypeAndName = async (headers: any) => {
    try {
      const url = '/api/v1/method.call/getRoomByTypeAndName';
      let data = await this.post(
        url,
        {
          message: JSON.stringify({
            msg: 'method',
            id: 98,
            method: 'getRoomByTypeAndName',
            params: ['d', "YwisTMuma3efTJwc7gGQMHdbEJ9WPqWwdf"],
          },)
        },
        headers
      );
      return data
    } catch (err) {
      console.log(err);
    }
  };

  login = async ({ user, password }: any) => {
    try {
      const url = '/api/v1/method.callAnon/login';
      let data = await this.post(url, {
        message: JSON.stringify({
          "msg": "method",
          "id": "3",
          "method": "login",
          "params": [
            {
              "user": {
                "username": "joffinjoy"
              },
              "password": {
                "digest": "0b94a2e7a713a793ccc42412047185b2ef179f710b1c6c3ef21841c93018b65e",
                "algorithm": "sha-256"
              }
            }
          ]
        })
      }, {});
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  // async login() {
  //   console.log('login')
  //   // try {
  //     const url = '/api/v1/login';
  //     let data = await this.post(url, { username: 'joffinjoy', password: 'qXN5tYzXTNYgqHj' }, {});
  //     console.log(data)
  //   // } catch (err) {
  //   //   console.log(err);
  //   //   return err
  //   // }
  // };

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async post(url: any, data: any, headers?: any) {
    console.log("post")
    url = 'https://chat-dev.elevate-apis.shikshalokam.org' + url;
    const response: any = await axios.post(url, data, { headers });
    return response
  };

  addNewMessage(inputField: any) {
    const val = inputField.value?.trim()
    if (val.length) {
      this.activeUser.messages.push({ type: 'sent', message: val, time: Date.now().toLocaleString })
      this.activeUser.ws.send(
        JSON.stringify({ id: this.activeUser.id, message: val })
      );
    }
    inputField.value = '';
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
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

  moreOptions(event: any) {
    //show popup
    console.log("Implement popup")
  }
}
