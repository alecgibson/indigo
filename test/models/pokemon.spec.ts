import { Pokemon } from '../../source/models/pokemon';
import { expect } from 'chai';
import 'mocha';

describe('Pokemon', () => {
    it('should have a number', () => {
        const bulbasaur = new Pokemon(1);
        expect(bulbasaur.number).to.equal(1);
    });
});
