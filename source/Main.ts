import container from "./inversify.config";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as http from "http";
import * as WebSocket from "ws";
import {WebSocketRouter} from "./Routes/WebSocketRouter";
import {IWebSocketRouter} from "./Routes/IWebSocketRouter";
import {UserService} from "./Users/UserService";
import {IUser} from "./Models/IUser";
import * as url from "url";

class Main {
  private static PORT = 8080;

  public static run() {
    let app = express();
    let server = http.createServer(app);
    let webSocketServer = new WebSocket.Server({server});

    let webSocketRouter = container.get<IWebSocketRouter>(WebSocketRouter);
    let userService = container.get<UserService>(UserService);

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true,
    }));

    // TODO: Tidy routes
    app.post('/login', (request, response) => {
        let username = request.body.username;
        let password = request.body.password;
        userService.getNewSessionToken(username, password)
          .then((token) => {
            response.send({
              token: token
            });
          });
      }
    );

    // TODO: Handle this properly
    app.post('/register', (request, response) => {
      let user = <IUser>request.body;
      userService.create(user)
        .then((user) => {
          response.send(user.id);
        });
    });

    app.get('/health', (request, response) => {
      response.send('OK');
    });

    webSocketServer.on('connection', (webSocket, request) => {
      let query = url.parse(request.url, true).query;
      let newSessionToken = query.token;
      webSocketRouter.connect(webSocket, newSessionToken);
    });

    server.listen(Main.PORT, function () {
      console.log(`Listening on port ${Main.PORT}`);
    });
  }
}

Main.run();
