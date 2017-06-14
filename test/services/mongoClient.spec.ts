import { MongoClient } from 'mongodb';

import { expect } from 'chai';
import 'mocha';

describe('Mongo Client', () => {
    it('should connect', () => {
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
           expect(err).to.equal(null);
           db.close();
        });
    });
});
