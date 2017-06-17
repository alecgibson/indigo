import container from "./inversify.config";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as WebSocket from "ws";
import {WebSocketRouter} from "./Routes/WebSocketRouter";
import {IWebSocketRouter} from "./Routes/IWebSocketRouter";

class Main {
    private static PORT = 8080;

    public static run() {
        let app = express();
        let server = http.createServer(app);
        let webSocketServer = new WebSocket.Server({ server });

        let webSocketRouter = container.get<IWebSocketRouter>(WebSocketRouter);

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));

        app.get('/health', (request, response) => {
            response.send('OK');
        });

        webSocketServer.on('connection', (webSocket) => {
            // TODO: Authenticate user
            // TODO: Store session in DB
            webSocket.on('message', (data) => {
                webSocketRouter.route(webSocket, data);
            });
        });

        server.listen(Main.PORT, function () {
            console.log(`Listening on port ${Main.PORT}`);
        });
    }
}

Main.run();
