import { HttpController } from '@yellow-snow/http';
import { FileMetadata } from '../models/file-metadata';
import { FileService } from '../service/file.service';
import { Resolve } from "tsnode-di";
import * as crypto from "crypto";
import * as Busboy from "busboy";
import { FileMetadataService } from '../service/file-metadata.service';
// import * as os from "os";
// import * as path from "path";
// import * as fs from "fs";

export class FileController extends HttpController {
    @Resolve(FileService)
    private fileService!: FileService;
    @Resolve(FileMetadataService)
    private fileMetadataService!: FileMetadataService;
    public async upload() {
        return new Promise(
            (resolve, reject) => {
                try {
                    let upload: Buffer = Buffer.alloc(0);
                    let stream: NodeJS.ReadableStream;
                    let metadata: FileMetadata;
                    const busboy = new Busboy({ headers: this.req.headers });
                    const fields = {};
                    const id: string = crypto.randomBytes(16).toString("hex");
                    busboy.on('field', (fieldname, val) => {
                        fields[fieldname] = val;
                    });
                    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                        stream = file;
                        stream.on("data", (data) => {
                            upload = Buffer.concat([upload, data]);
                        });
                        stream.on("end", () => {
                            //
                        });
                    });
                    busboy.on('finish', async () => {
                        metadata = <FileMetadata>fields;
                        metadata.id = id;
                        console.log(metadata);
                        if (upload === undefined) {
                            console.log("No file uploaded");
                            this.res.status(500);
                            this.res.send();
                        } else if (metadata === undefined) {
                            console.log("Could not save metadata");
                            this.res.status(500);
                            this.res.send();
                        } else {
                            try {
                                await this.fileMetadataService.save(metadata);
                                await this.fileService.save(id, upload);
                                this.res.send(metadata);
                            } catch(e) {
                                console.log(e);
                                this.res.status(500);
                                this.res.send();
                            }
                        }
                    });
                    if ((<any>this.req).rawBody) {
                        busboy.end((<any>this.req).rawBody);
                    }
                    else {
                        this.req.pipe(busboy);
                    }
                } catch (e) {
                    console.log(e);
                    this.res.status(500);
                    this.res.send();
                }
            }
        );
    }
    public async download() {
        try {
            const id = this.req.params.id;
            const buffer: Buffer = await this.fileService.getFile(id);
            this.res.send(buffer);
        } catch(e) {
            console.log(e);
            this.res.status(500);
            this.res.send();
        }
    }
    public async getFileMetadata() {
        try {
            const id = this.req.params.id;
            const metadata: FileMetadata = await this.fileMetadataService.getFileMetadata(id);
            this.res.send(metadata);
        } catch(e) {
            console.log(e);
            this.res.status(500);
            this.res.send();
        }
    }
}