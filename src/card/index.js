import { ranks } from '../deck';

export default class Card {
  constructor({ suit, rank }) {
    this.suit = suit;
    this.rank = rank;
  }
  
  toString() {
    return `${this.rank}${this.suit}`;
  }

  toJSON() {
    return this.toString()
  }

  isHigherRank(card) {
    return ranks[this.rank] > ranks[card.rank];
  }

  isSameSuit(card) {
    return this.suit === card.suit;
  }
}
