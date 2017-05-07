import Player from '../player';
import Deck from '../deck';

export default class Game {
  constructor({ id, playerIds }) {
    const playerCount = playerIds.length;
    if (playerCount > 5 || playerCount < 2) {
      throw new Error(`Invalid number of players: ${playerCount}`);
    }
    this.id = id;
    this.deck = new Deck()
    this.deck.shuffle();
    this.cardsOffense = [];
    this.cardsDefense = [];
    this.players = playerIds.map(id => new Player({ id }));
    this.deal();
    this.setTrump();
    this.determineFirstPlayer();
    // ngs = dealer.updateLegalMoves({ cgs: ngs }).ngs;
  }

  deal() {
    // give out cards to players
    this.players.forEach((player) => {
      while (player.cards.length < 6) {
        player.cards.push(this.deck.cards.pop());
      }
    });

    // increment round
    this.round ? this.round +=1 : this.round = 1;
  }

  setTrump () {
    this.deck.cards.unshift(this.deck.cards.pop());
    this.trump = this.deck.cards[0];
  }

  determineFirstPlayer() {
    const { players, trump: { rank: trumpRank, suit: trumpSuit} } = this;
    const lt = {}; // lowestTrump
    const setLowestTrump = (card, index) => {
      if (card[1] === trumpSuit) {
        if (!lt.card || (lt.card === dealer.returnHigherRank(lt.card, card))) {
          lt.card = card;
          lt.player = index;
        }
      }
    };
    players.forEach((p, i) => p.cards.forEach(c => setLowestTrump(c, i)));
    this.lowestTrump = lt;
    return this;
  }
}
