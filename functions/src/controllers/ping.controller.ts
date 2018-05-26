import { HttpController } from '@yellow-snow/http';

export class PingController extends HttpController {
    public async ping() {
        try {
            this.res.send("pong");
        } catch(e) {
            console.log(e);
            this.res.status(500);
            this.res.send();
        }
    }
}