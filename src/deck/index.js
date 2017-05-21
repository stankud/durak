import shuffle from 'lodash.shuffle';
import Card from '../card';

const suits = [
  'H',
  'D',
  'S',
  'C'
];
const ranks = {
  A: 9,
  K: 8,
  Q: 7,
  J: 6,
  T: 5,
  9: 4,
  8: 3,
  7: 1,
  6: 0
};

export default class Deck {
  constructor({ savedDeck } = {}) {
    this.cards = [];
    this.suits = suits;
    this.ranks = ranks;
    if (savedDeck) this._loadSavedDeck({ savedDeck });
    else this._createNewDeck();
  }
  /* *** PUBLIC *** */
  shuffle () {
    this.cards = shuffle(this.cards);
  }

  toJSON () {
    return this.cards.map(card => card.toString())
  }
  /* *** PRIVATE *** */
  _createNewDeck() {
    suits.forEach(suit => Object.keys(ranks).forEach(rank => this.cards.push(new Card({ rank, suit }))));
  }

  _loadSavedDeck({ savedDeck }) {
    savedDeck.forEach(card => this.cards.push(new Card({ rank: card[0], suit: card[1]})));
  }
}
