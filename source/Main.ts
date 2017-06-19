import container from "./inversify.config";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as expressSession from "express-session";
import * as http from "http";
import * as WebSocket from "ws";
import {WebSocketRouter} from "./Routes/WebSocketRouter";
import {IWebSocketRouter} from "./Routes/IWebSocketRouter";
import * as passport from "passport";
import * as PassportLocal from "passport-local";
import {UserService} from "./Users/UserService";
import {IUser} from "./Models/IUser";

class Main {
  private static PORT = 8080;

  public static run() {
    let app = express();
    let server = http.createServer(app);
    let webSocketServer = new WebSocket.Server({server});

    let webSocketRouter = container.get<IWebSocketRouter>(WebSocketRouter);
    let userService = container.get<UserService>(UserService);

    passport.use(new PassportLocal.Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username: string, password: string, done) => {
        userService.authenticateUser(username, password)
          .then((user) => {
            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
          })
          .catch(done);
      }
    ));

    passport.serializeUser((user: IUser, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id: string, done) => {
      userService.get(id)
        .then((user) => {
          done(null, user);
        })
        .catch(done);
    });

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true,
    }));
    app.use(expressSession({
      // TODO: Update
      secret: 'keyboardcat',
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 86400000, // TODO: Actually think about this number
        secure: false, // TODO: Change in production
      },
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // TODO: Tidy routes
    app.post('/login',
      passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/failure',
      }),
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

    webSocketServer.on('connection', (webSocket) => {
      // TODO: Authenticate user
      // TODO: Store session
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
