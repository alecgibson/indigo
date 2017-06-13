"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokemon_1 = require("../../source/models/pokemon");
var chai_1 = require("chai");
require("mocha");
describe('Pokemon', function () {
    it('should have a number', function () {
        var bulbasaur = new pokemon_1.Pokemon(1);
        chai_1.expect(bulbasaur.number).to.equal(1);
    });
});
