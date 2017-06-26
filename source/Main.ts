import container from "./inversify.config";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as http from "http";
import * as WebSocket from "ws";
import {WebSocketRouter} from "./routes/WebSocketRouter";
import {UserService} from "./users/UserService";
import {IUser} from "./models/IUser";
import * as url from "url";
import {SessionService} from "./users/SessionService";
import {CronJob} from "cron";
import {WildEncounterGenerator} from "./encounters/WildEncounterGenerator";

class Main {
  private static PORT = 8080;

  public static run() {
    let app = express();
    let server = http.createServer(app);
    let webSocketServer = new WebSocket.Server({server});

    let webSocketRouter = container.get<WebSocketRouter>(WebSocketRouter);
    let users = container.get<UserService>(UserService);
    let sessions = container.get<SessionService>(SessionService);
    let wildEncounters = container.get<WildEncounterGenerator>(WildEncounterGenerator);

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true,
    }));

    // TODO: Tidy routes
    app.post('/login', (request, response) => {
        let username = request.body.username;
        let password = request.body.password;
        sessions.getNewSessionToken(username, password)
          .then((token) => {
            if (token) {
              response.send({
                token: token
              });
            } else {
              response.status(401).end();
            }
          });
      }
    );

    // TODO: Tidy routes
    // TODO: Handle errors
    app.post('/register', (request, response) => {
      let user = <IUser>request.body;
      users.create(user)
        .then((user) => {
          response.send(user.id);
        });
    });

    // TODO: Tidy routes
    app.get('/health', (request, response) => {
      response.send('OK');
    });

    webSocketServer.on('connection', (webSocket, request) => {
      let queryMatch = request.url.match(/\?(.+)/);
      let newSessionToken = queryMatch && queryMatch[1];
      webSocketRouter.connect(webSocket, newSessionToken);
    });

    // new CronJob(`*/${WildEncounterGenerator.JOB_FREQUENCY_SECONDS} * * * * *`, () => {
    //   wildEncounters.generate();
    // }, null, true).start();

    server.listen(Main.PORT, function () {
      console.log(`Listening on port ${Main.PORT}`);
    });
  }
}

Main.run();
