import { Test } from "./test";

export class Request {
    _id:String;
    requesterUsername: String;
    description: String;
    priority: String;
    userState: String;
    submitDate: Date;
    firstTest: Test;
    secondTest: Test;
    resultDate: Date;
    isInfected: String;
};