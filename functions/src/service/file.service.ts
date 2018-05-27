import { Firebase } from "../models/firebase";
import { Resolve } from "tsnode-di";
import * as firebase from "firebase-admin";

export class FileService {
    @Resolve(Firebase)
    private firebase: Firebase;
    private storage: firebase.storage.Storage;
    constructor() {
        this.storage = this.firebase.app.storage();
    }
    public async save(filename: string, file: Buffer) {
        return new Promise(
            (resolve, reject) => {
                const path: string = `uploads/${filename}`;
                const upload = this.storage.bucket().file(path);
                const writeStream = upload.createWriteStream();
                writeStream.on("error", (error) => {
                    reject(error);
                });
                writeStream.on("finish", () => {
                    resolve();
                });
                writeStream.end(file);
            }
        )
    }
    public async getFile(filename) {
        return new Promise<any>(
            async (resolve, reject) => {
                const path: string = `uploads/${filename}`;
                const download = this.storage.bucket().file(path);
                const readStream = download.createReadStream();
                let buffer = Buffer.alloc(0);
                readStream.on("error", (error: any) => {
                    reject(error);
                });
                readStream.on("data", (data: any) => {
                    buffer = Buffer.concat([buffer, data]);
                });
                readStream.on("finish", () => {
                    resolve(buffer);
                });
                readStream.read();
            }
        )

    }
}