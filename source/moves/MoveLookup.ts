import {injectable} from "inversify";
import * as fs from "fs";
import * as yaml from "js-yaml";
import {IMove} from "../models/IMove";

@injectable()
export class MoveLookup {
  private readonly DATA_DIRECTORY = 'data/moves';
  private readonly moves = [];

  public constructor() {
    fs.readdirSync(this.DATA_DIRECTORY).forEach((filename) => {
      let moveYaml = fs.readFileSync(`${this.DATA_DIRECTORY}/${filename}`, 'utf8');
      let move = yaml.safeLoad(moveYaml);
      this.moves.push(move);
    });
  }

  public byId(id: number): IMove {
    return this.moves[id - 1];
  }
}
