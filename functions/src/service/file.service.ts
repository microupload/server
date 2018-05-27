import * as firebase from "firebase-admin"

export class FileService {
    private storage = firebase.initializeApp().storage();
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
}