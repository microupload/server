import { Injectable } from "tsnode-di";
import * as firebase from "firebase-admin";

@Injectable()
export class Firebase {
    private static firebase: firebase.app.App;
    constructor() {
        Firebase.firebase = firebase.initializeApp();
    }
    public get app() {
        return Firebase.firebase;
    }
}