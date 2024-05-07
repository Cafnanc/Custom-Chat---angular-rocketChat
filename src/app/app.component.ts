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
  user: any;
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
  ws = new WebSocket('ws://chat-dev.elevate-apis.shikshalokam.org/websocket');
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  async ngOnInit() {
    this.setUserActive(USERS[0])
    this.scrollToBottom();
    this.userId = 'gGQMHdbEJ9WPqWwdf'


    //login
    let data = await this.login({ username: 'joffinjoy', password: 'qXN5tYzXTNYgqHj' })

    let msgData = {
      "msg": "sub",
      "id": '' + new Date().getTime(),
      "name":"meteor.loginServiceConfiguration",
      "params": [
      ]
    }
    console.log("send")
    this.ws.send(JSON.stringify(msgData))

    //setting local
    let locStore = await this.localStorage.setLocalData("Meteor.loginToken", JSON.parse(data.data.message).result.token)
    const date = new Date(JSON.parse(data.data.message).result.tokenExpires.$date * 1000);
    const formattedDate = date.toString();
    await this.localStorage.setLocalData("Meteor.loginTokenExpires", formattedDate)
    await this.localStorage.setLocalData("Meteor.userId", JSON.parse(data.data.message).result.id)


    //STreams
    this.ws.send(JSON.stringify({
      "msg": "sub",
      "id": '' + new Date().getTime(), // unique ID for subscription
      "name": "stream-room-messages", // name of the subscription
      "params": ['YwisTMuma3efTJwc7gGQMHdbEJ9WPqWwdf', {
        "useCollection": false,
        "args": []
    }]
    }));
    this.ws.send(JSON.stringify({"msg":"sub","id":'' + new Date().getTime(),"name":"stream-notify-user","params":["gGQMHdbEJ9WPqWwdf/rooms-changed",{"useCollection":false,"args":[]}]}))

    //getRoomRoles
    const headers = {
      'X-Auth-Token': await this.localStorage.getLocalData("Meteor.loginToken"),
      'X-User-Id': 'gGQMHdbEJ9WPqWwdf',
      // You can add more headers if needed
    };

    let getRoomRoles = await this.getRoomRoles(headers);
    // console.log("Room roles API: ",getRoomRoles)

    let getRoomByTypeAndName = await this.getRoomByTypeAndName(headers)
    // console.log("Room bt type and name API: ",getRoomByTypeAndName)
    // console.log(JSON.parse(getRoomByTypeAndName.data.message))

    let loadHistory = await this.loadHistory(headers)
    // console.log("Load history API: ", loadHistory)
    // console.log(JSON.parse(loadHistory.data.message))

    let userInfo = await this.userInfo(headers)
    console.log(userInfo.data)
    this.user = userInfo.data.user
  }

  async userInfo(headers: { 'X-Auth-Token': string; 'X-User-Id': string; }) {
    try {
      const url = '/api/v1/users.info?username=joffinjoy';
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
    // console.log("get")
    url = 'https://chat-dev.elevate-apis.shikshalokam.org' + url;
    const response: any = await axios.get(url, { headers });
    return response
  }

  async loadHistory(headers: { 'X-Auth-Token': string; 'X-User-Id': string; }) {
    try {
      const url = '/api/v1/method.call/loadHistory';
      let data = await this.post(
        url,
        {
          message: JSON.stringify({ "msg": "method", "id": '' + new Date().getTime(), "method": "loadHistory", "params": ["YwisTMuma3efTJwc7gGQMHdbEJ9WPqWwdf", null, 50, '' + new Date().toLocaleString(), false] })
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
      "id": '' + new Date().getTime(),
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
            id: '' + new Date().getTime(),
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

  sendMessage = async (headers: any, msg: any) => {
    try {
      const url = '/api/v1/method.call/sendMessage';
      let data = await this.post(
        url,
        {
          message: JSON.stringify({
            "msg": "method",
            "id": '' + new Date().getTime(),
            "method": "sendMessage",
            "params": [
              {
                "_id": '' + new Date().getTime(),
                "rid": "YwisTMuma3efTJwc7gGQMHdbEJ9WPqWwdf",
                "msg": msg
              },
              null
            ]
          },)
        },
        headers
      );
      return data
    } catch (err) {
      console.log(err);
    }
  };

  subscribeToRoom = async (headers: any, rid: any) => {
    try {
      const url = '/api/v1/subscriptions.read';
      let data = await this.post(
        url,
        {
          rid: rid
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
          "id": '' + new Date().getTime(),
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
      this.ws.send(JSON.stringify({"msg":"method","id":"1","method":"login","params":[{"resume":await this.localStorage.getLocalData("Meteor.loginToken")}]}))
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async post(url: any, data: any, headers?: any) {
    url = 'https://chat-dev.elevate-apis.shikshalokam.org' + url;
    const response: any = await axios.post(url, data, { headers });
    return response
  };

  async addNewMessage(inputField: any) {
    const headers = {
      'X-Auth-Token': await this.localStorage.getLocalData("Meteor.loginToken"),
      'X-User-Id': 'gGQMHdbEJ9WPqWwdf',
      // You can add more headers if needed
    };
    let data = await this.sendMessage(headers, inputField.value?.trim())
    const val = inputField.value?.trim()
    console.log(this.messagesArray , val)
    // this.messagesArray.push({msg: val, u: {_id: this.userId}, ts: { $date: new Date().getTime()}})
    inputField.value = '';
    // if (val.length) {
    //   this.activeUser.messages.push({ type: 'sent', message: val, time: Date.now().toLocaleString })
    //   this.activeUser.ws.send(
    //     JSON.stringify({ id: this.activeUser.id, message: val })
    //   );
    // }
    // inputField.value = '';

    // const headers = {
    //   'X-Auth-Token': await this.localStorage.setLocalData("Meteor.loginToken"),
    //   'X-User-Id': 'gGQMHdbEJ9WPqWwdf',
    //   // You can add more headers if needed
    // };
    // let data = await this.sendMessage(headers, inputField.value?.trim())
    // console.log("Send msg: ", data)
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
    if (this.activeUser.ws && this.activeUser.ws.readyState !== 1) {
      this.activeUser.ws = null;
      this.activeUser.status = STATUSES.OFFLINE;
    }
    if (this.activeUser.ws) {
      return;
    }

    this.activeUser.ws = this.ws;
    this.ws.onopen = (event) => {
      this.onWSEvent(event, STATUSES.ONLINE)
      console.log('WebSocket connection established.');
      const connectionMessage = {
        "msg": "connect",
        "version": "1",
        "support": ["1", "pre2", "pre1"]
      }
      this.ws.send(JSON.stringify(connectionMessage));
      // Subscribe to specific channels or events after connection is established

    };
    this.ws.onclose = (event) => this.onWSEvent(event, STATUSES.OFFLINE);
    this.ws.onerror = (event) => this.onWSEvent(event, STATUSES.OFFLINE);
    this.ws.onmessage = (result: any) => {

      if (JSON.parse(result.data).msg === 'ping') {
        // If a ping message is received, respond with a pong message
        const pongMessage = {
          msg: 'pong',
        };
        this.ws.send(JSON.stringify(pongMessage));
      } else {
        if(JSON.parse(result.data).msg=='changed'){
          console.log(JSON.parse(result?.data))
          this.messagesArray.push(JSON.parse(result.data).fields?.args[0])
        }
        // const data = JSON.parse(result?.data || {});
        // const userFound = this.users.find(u => u.id === data.id);
        // if (userFound) {
        //   userFound.messages.push(
        //     new Message('replies', data.message, Date.now().toLocaleString())
        //   )
        // }
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
