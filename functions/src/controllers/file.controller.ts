import { HttpController } from '@yellow-snow/http';
import { FileMetadata } from '../models/file-metadata';
import { FileService } from '../service/file.service';
import { Resolve } from "tsnode-di";
import * as crypto from "crypto";
import * as Busboy from "busboy";
// import * as os from "os";
// import * as path from "path";
// import * as fs from "fs";

export class FileController extends HttpController {
    @Resolve(FileService)
    private fileService!: FileService;
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
                        metadata = {
                            id,
                            filename,
                            encoding,
                            mimetype,
                            size: -1.
                        };
                        stream.on("data", (data) => {
                            upload = Buffer.concat([upload, data]);
                        });
                        stream.on("end", () => {
                            metadata.size = upload.length;
                        });
                    });
                    busboy.on('finish', async () => {
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