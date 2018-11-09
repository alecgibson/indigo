import Factory from './factory';
import { expect } from 'chai';

describe('Factory', () => {
  describe('of a simple interface', () => {
    interface IBook {
      title: string;
      authors: string[];
      isbn: {
        epub: string;
        pdf: string;
      };
    }

    class BookFactory extends Factory<IBook> {
      protected base(): IBook {
        return {
          title: 'Good omens',
          authors: [
            'Terry Pratchett',
            'Neil Gaiman',
          ],
          isbn: {
            epub: '123',
            pdf: '456',
          },
        };
      }
    }

    it('provides the default when no override is given', () => {
      const book = new BookFactory().build();
      expect(book).to.deep.equal({
        title: 'Good omens',
        authors: [
          'Terry Pratchett',
          'Neil Gaiman',
        ],
        isbn: {
          epub: '123',
          pdf: '456',
        },
      });
    });

    it('can override a field I care about, keeping other fields OK', () => {
      const book = new BookFactory().build((b: IBook) => {
        b.title = '668—The Neighbour of the Beast';
      });

      expect(book.title).to.equal('668—The Neighbour of the Beast');
      expect(book.isbn.epub).to.be.ok;
    });
  });
});
