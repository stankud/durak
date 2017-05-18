import Player from '../player';
import Deck from '../deck';
import Card from '../card'

const moves = [
  'attack',
  'defend',
  'throw-in',
  'end-attack',
  'pick-up'
];

export default class Game {
  constructor({ id, playerIds, savedGame }) {
    if (savedGame) this._loadSavedGame({ savedGame });
    else this._createNewGame({ id, playerIds });
  }
  /* *** PUBLIC *** */

  saveGame() {
    
  }

  makeMove() {

  }
  /* *** PRIVATE *** */
  _createNewGame({ id, playerIds }) {
    const playerCount = playerIds.length;
    if (playerCount > 5 || playerCount < 2) {
      throw new Error(`Invalid number of players: ${playerCount}`);
    }
    this.id = id;
    this.deck = new Deck();
    this.deck.shuffle();
    this.cardsOffense = [];
    this.cardsDefense = [];
    this.players = playerIds.map(id => new Player({ id }));
    this._deal();
    this._setTrump();
    this._determineFirstPlayer();
    // ngs = dealer.updateLegalMoves({ cgs: ngs }).ngs;
  }

  _loadSavedGame({ savedGame }) {
    const {
      id,
      savedDeck,
      cardsOffense,
      cardsDefense,
      players,
      trumpCard,
      round,
      lowestTrump
    } = savedGame;
    this.id = id;
    this.deck = new Deck({ savedDeck });
    this.cardsOffense = cardsOffense;
    this.cardsDefense = cardsDefense;
    this.players = players.map(({ id, cards }) => new Player({ id, cards }));
    this.trumpCard = new Card({
      rank: trumpCard[0],
      suit: trumpCard[1]
    });
    this.lowestTrump = {
      card: this._getCard({
        rank: lowestTrump.card[0],
        suit: lowestTrump.card[1]
      }),
      player: this._getPlayerById(lowestTrump.player)
    };
    this.round = round;
  }

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

  _getPlayerById(id) {
    const player = this.players.find((player) => player.id === id);
    return player;
  }

  _getCard({ suit, rank }) {
    const card = this.deck.cards.find((card) => card.suit === suit && card.rank === rank);
    return card;
  }
}
