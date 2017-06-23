import {IStoredPokemon} from "../models/IStoredPokemon";
const Pokemon = require("../sequelize/index").pokemon;

export class PokemonService {
  public create(pokemon: IStoredPokemon): Promise<IStoredPokemon> {
    return Pokemon.create({
      json: JSON.stringify(pokemon)
    });
  }

  public get(id: string): Promise<IStoredPokemon> {
    return Pokemon.findById(id)
      .then((pokemon) => {
        console.log(pokemon);
        let json = JSON.parse(pokemon.json);
        console.log(json);
        json.id = pokemon.id;
        return json;
      });
  }
}
