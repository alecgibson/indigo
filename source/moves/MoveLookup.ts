import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import IMove from './IMove';

export default class MoveLookup {
  private readonly DATA_DIRECTORY = 'data/moves';
  private readonly moves: IMove[] = [];

  public constructor() {
    fs.readdirSync(this.DATA_DIRECTORY).forEach(filename => {
      const moveYaml = fs.readFileSync(`${this.DATA_DIRECTORY}/${filename}`, 'utf8');
      const move = yaml.safeLoad(moveYaml);
      this.moves.push(move);
    });
  }

  public byId(id: number): IMove {
    return this.moves[id - 1];
  }
}
