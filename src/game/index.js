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
    this._deal();
    this._setTrump();
    this._determineFirstPlayer();
    // ngs = dealer.updateLegalMoves({ cgs: ngs }).ngs;
  }
  /* *** PUBLIC *** */
  makeMove() {

  }
  /* *** PRIVATE *** */
  _deal() {
    // give out cards to players
    this.players.forEach((player) => {
      while (player.cards.length < 6) {
        player.cards.push(this.deck.cards.pop());
      }
    });

    // increment round
    this.round ? this.round +=1 : this.round = 1;
  }

  _setTrump () {
    this.deck.cards.unshift(this.deck.cards.pop());
    this.trumpCard = this.deck.cards[0];
  }

  _determineFirstPlayer() {
    const { players, trumpCard: { rank: trumpRank, suit: trumpSuit }} = this;
    const lt = {}; // lowestTrump
    const setLowestTrump = (card, player) => {
      if (card.suit === trumpSuit) {
        if (!lt.card || (lt.card === this._returnHigherRank(lt.card, card))) {
          lt.card = card;
          lt.player = player;
        }
      }
    };
    players.forEach((p) => p.cards.forEach(c => setLowestTrump(c, p)));
    this.lowestTrump = lt;
  }

  _returnHigherRank(card1, card2) {
    return this.deck.ranks[card1.rank] > this.deck.ranks[card2.rank] ? card1 : card2;
  }
}
