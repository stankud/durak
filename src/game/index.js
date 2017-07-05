import Player from '../player';
import Deck from '../deck';
import Card from '../card'

const MOVES = [
  'attack', // 0
  'defend', // 1
  'throw-in', // 2
  'end-attack', // 3
  'pick-up' // 4
];

const STATUSES = [
  'attacker',
  'defender',
  'thrower'
];

export default class Game {
  constructor({ id, playerIds, savedGame }) {
    if (savedGame) this._loadSavedGame({ savedGame });
    else this._createNewGame({ id, playerIds });
  }
  /* *** PUBLIC *** */

  toJSON() {
    const json = {};
    for (const prop in this) {
      if (Array.isArray(this[prop])) {
        json[prop] = this[prop].map((item) => (
          item.toJSON ? item.toJSON() : item
        ));
      } else {
        json[prop] = this[prop].toJSON ?
          this[prop].toJSON() :
          this[prop];
      }
    }
    return json;
  }

  makeMove({ move }) {
    const result = { ok: false };
    const player = this._getPlayerById(move.playerId);
    const card = new Card({ rank: move.card[0], suit: move.card[1] });
    const cardOffense = move.cardOffense 
      ? new Card({ rank: move.cardOffense[0], suit: move.cardOffense[1] })
      : null;
    const type = move.type;
    if (!player) {
      result.message = 'Player not found';
      return result;
    }
    const { hasCard: playerHasCard } = player.doesHaveCard(card);
    if (!playerHasCard) {
      result.message = "Player doesn't have card";
      return result;
    }
    const { valid, message: ValidateMessage } = this._validateMove({ player, card, type, cardOffense });
    if (!valid) {
      result.message = validateMessage;
      return result;
    }
    const executeMoveResult = this._executeMove({ player, card, type, cardOffense });
    if (!executeMoveResult.ok) {
      result.message = executeMoveResult.message;
      return result;
    }
    result.ok = true;
    return result;
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
      deck,
      cardsOffense,
      cardsDefense,
      players,
      trumpCard,
      round,
      lowestTrumpCard,
      lowestTrumpPlayerId
    } = savedGame;
    this.id = id;
    this.deck = new Deck({ savedDeck: deck });
    this.cardsOffense = cardsOffense.map(c => new Card({ rank: c[0], suit: c[1] }));
    this.cardsDefense = cardsDefense.map(c => new Card({ rank: c[0], suit: c[1] }));
    this.players = players.map(({ id, cards, status }) => {
      const _cards = cards.map(c => new Card({ rank: c[0], suit: c[1] }));
      return new Player({ id, cards: _cards, status });
    });
    this.trumpCard = new Card({
      rank: trumpCard[0],
      suit: trumpCard[1]
    });
    this.lowestTrumpCard = new Card({
      rank: lowestTrumpCard[0],
      suit: lowestTrumpCard[1]
    });
    this.lowestTrumpPlayerId = lowestTrumpPlayerId;
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

  _setTrump() {
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
    this.lowestTrumpCard = lt.card;
    this.lowestTrumpPlayerId = lt.player.id;
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

  _validateMove({ type, player, card, cardOffense }) {
    const result = { valid: false };
    const playerStatus = player.status;
    switch (type) { // move type
      case MOVES[0]: // attack
        if (['attacker'].indexOf(playerStatus) < 0) {
          result.message = `Incorrect player status: ${playerStatus}`;
          break;
        }
        result.valid = true;        
        break;
      case MOVES[1]: // defend
        if (['defender'].indexOf(playerStatus) < 0) {
          result.message = `Incorrect player status: ${playerStatus}`;
          break;
        }
        const { canDefend } = this._canDefendWithCard({ card, cardOffense });
        result.valid = true;
        break;
      case MOVES[2]: // throw-in
        if (['thrower', 'attacker'].indexOf(playerStatus) < 0) {
          result.message = `Incorrect player status: ${playerStatus}`;
          break;
        }
        const { canThrowIn } = this._canThrowInCard(card);
        if (canThrowIn) {
          result.valid = true;
          break;
        }
        break;
      case MOVES[3]: // end-attack
        if (['thrower', 'attacker', 'defender'].indexOf(playerStatus) < 0) {
          result.message = `Incorrect player status: ${playerStatus}`;
          break;
        }
        result.valid = true;
        break;
      case MOVES[4]: // pick-up
        if (['defender'].indexOf(playerStatus) < 0) {
          result.message = `Incorrect player status: ${playerStatus}`;
          break;
        }
        result.valid = true;
        break;
      default:
        result.message = `Unsupported move type: ${type}`;
    }
    return result;
  }

  _executeMove({ player, card, type, cardOffense }) {
    const result = { ok: false };
    switch (type) {
      case MOVES[0]: // attack
        
        break;
      case MOVES[1]: // defend
        player.removeCard(card);
        const cardOffenseIdx = this.cardsOffense.findIndex((card) => (
          card.toString() === cardOffense.toString())
        );
        this.cardsDefense[cardOffenseIdx] = card;
        result.ok = true;
        break;
      case MOVES[2]: // throw-in
        player.removeCard(card);
        this.cardsOffense.push(card);
        result.ok = true;
        break;
      case MOVES[3]: // end-attack

        break;
      case MOVES[4]: // pick-up

        break;
      default:
        result.message = `Unsupported move type: ${type}`;
    }
    return result;
  }

  _canThrowInCard(card) {
    const result = this.cardsDefense.concat(this.cardsOffense).find((tableCard) => {
      return tableCard.rank === card.rank
    });
    const canThrowIn = !!result;
    return { canThrowIn };
  }

  _canDefendWithCard({ card, cardOffense }) {
    let canDefend = false;
    if (card.isHigherRank(cardOffense) && card.isSameSuit(cardOffense)) {
      canDefend = true;
    } else if (card.suit === this.trumpCard.suit) {
      canDefend = true;
    }
    return { canDefend };
  }

}
