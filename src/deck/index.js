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
  constructor() {
    const cards = [];
    suits.forEach(suit => Object.keys(ranks).forEach(rank => cards.push(new Card({ rank, suit }))));
    this.cards = cards;
    this.suits = suits;
    this.ranks = ranks;
  }

  shuffle () {
    this.cards = shuffle(this.cards);
  }
}
