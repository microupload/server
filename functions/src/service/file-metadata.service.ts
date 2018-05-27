import * as firebase from "firebase-admin"
import { FileMetadata } from "../models/file-metadata";
import { Firebase } from "../models/firebase";
import { Resolve } from "tsnode-di";

export class FileMetadataService {
    @Resolve(Firebase)
    private firebase: Firebase;
    private firestore: firebase.firestore.Firestore;
    constructor() {
        this.firestore = this.firebase.app.firestore();
    }
    public async save(metadata: FileMetadata) {
        await this.firestore.collection("file_metadata").doc(metadata.id).set(metadata);
    }
    public async getFileMetadata(id:string) {
        const docRef = await this.firestore.collection("file_metadata").doc(id).get();
        const metadata: FileMetadata = <FileMetadata> docRef.data();
        return metadata;
    }
}