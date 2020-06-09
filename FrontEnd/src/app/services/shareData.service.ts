import { Injectable } from '@angular/core';

@Injectable()
export class ShareDataService {

  currentMessage:String = "";

  constructor() { }

  changeMessage(message: String) {
    this.currentMessage = message;
  }
}