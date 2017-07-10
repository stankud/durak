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
  'thrower',
  'winner'
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
        json[prop] = (this[prop] && this[prop].toJSON) ?
          this[prop].toJSON() :
          this[prop];
      }
    }
    return json;
  }

  makeMove({ move }) {
    const result = { ok: false };
    const player = this._getPlayerById(move.playerId);
    const { canMove } = this._canMove({ player });
    if (!canMove) {
      result.message = `Player already ended attack: ${player.id}`;
      return result;
    }
    const card = move.card
      ? new Card({ rank: move.card[0], suit: move.card[1] })
      : null;
    const cardOffense = move.cardOffense
      ? new Card({ rank: move.cardOffense[0], suit: move.cardOffense[1] })
      : null;
    const type = move.type;
    if (!player) {
      result.message = 'Player not found';
      return result;
    }
    if (card) {
      const { hasCard: playerHasCard } = player.doesHaveCard(card);
      if (!playerHasCard) {
        result.message = "Player doesn't have card";
        return result;
      }
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
    const { canEndRound } = this._canEndRound();
    if (canEndRound) {
      this._endRound({ player });
      result.message = 'Round ended';
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
    this.endAttackPlayerIdList = [];
    this.cardsBeaten = [];
    this.players = playerIds.map(id => new Player({ id }));
    this.round = 1;
    this._deal();
    this._updatePlayerStatuses();
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
      endAttackPlayerIdList,
      pickUpPlayerId,
      cardsBeaten,
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
    this.endAttackPlayerIdList = endAttackPlayerIdList || [];
    this.pickUpPlayerId = pickUpPlayerId || null;
    this.cardsBeaten = cardsBeaten || [];
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

  _updatePlayerStatuses() {
    const playerCount = this.players.length;
    const offset = this.pickUpPlayerId ? 1 : 0;
    const round = this.round;
    if (!round || round === 1) { // intial update

    } else { // subsequent update
      const defenderIdx = this._getDefenderIdx() + offset;
      const newAttackerIdx = (defenderIdx < playerCount)
        ? defenderIdx : defenderIdx - playerCount;
      const newDefenderIdx = (defenderIdx + 1) < playerCount
        ? (defenderIdx + 1) : (defenderIdx + 1) - playerCount;
      this.players.forEach((player, idx) => {
        let newStatus = 'thrower';
        if (idx === newAttackerIdx) {
          newStatus = 'attacker';
        } else if (idx === newDefenderIdx) {
          newStatus = 'defender';
        }
        player.status = newStatus;
      });
    }
  }

  _deal() {
    const attackerIdx = this._getAttackerIdx();
    const defenderIdx = this._getDefenderIdx();
    const playerCount = this.players.length;
    // keen the loop going 2 extra iterations to circle back around to defender
    const playerCountWithOffset = playerCount + 2;
    if (attackerIdx < 0 ) { // first deal
      this.players.forEach((player) => {
        while (player.cards.length < 6) {
          player.cards.push(this.deck.cards.pop());
        }
      });
    } else { // subsequent deals
      labelCancelLoops: for (let i = 0; i < playerCountWithOffset; i += 1) {
        let playerIdx = i + attackerIdx; // deal to attacker first
        playerIdx = playerIdx < playerCount ? playerIdx : playerIdx % playerCount;
         // skip defender during first iteration
        if (playerIdx === defenderIdx && i < playerCount) continue;
        const player = this.players[playerIdx];
        while (!player.hasFullHand()) {
          if (this.deck.cards.length < 1) break labelCancelLoops;
          player.cards.push(this.deck.cards.pop());
        }
      }
    }
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
      const { canEndAttack } = this._canEndAttack();
        if (canEndAttack) {
          result.valid = true;
        }
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
        player.removeCard(card);
        this.cardsOffense.push(card);
        result.ok = true;
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
        this.endAttackPlayerIdList.push(player.id);
        result.ok = true;
        break;
      case MOVES[4]: // pick-up
        this.pickUpPlayerId = player.id;
        result.ok = true;
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

  _canMove({ player }) {
    const endedAttack = this.endAttackPlayerIdList.find((playerId) => (
      playerId === player.id
    ));
    const { hasCards } = player.hasCards();
    const canMove = (!endedAttack && hasCards);
    return { canMove };
  }

  _canEndAttack() {
    const allCardsDefened = this.cardsDefense.length === this.cardsOffense.length;
    const canEndAttack = allCardsDefened;
    return { canEndAttack };
  }

  _getActivePlayerCount() {
    const count = this.players.reduce((prev, player) => {
      const { hasCards } = player.hasCards();
      if (hasCards) {
        prev += 1;
      }
      return prev;
    }, 0);
    return count;
  }

  _canEndRound() {
    const activePlayerCount = this._getActivePlayerCount();
    const offset = this.pickUpPlayerId ? 1 : 0;
    const endAttackCount = this.endAttackPlayerIdList.length + offset;
    const canEndRound = endAttackCount === activePlayerCount;
    return { canEndRound };
  }

  _endRound({ player }) {
    this.round ? this.round += 1 : this.round = 1;
    this._cleanTableCards({ player });
    this._deal();
    this.endAttackPlayerIdList = [];
    this.pickUpPlayerId = null;
    this._updatePlayerStatuses()
  }

  _cleanTableCards({ player }) {
    this.cardsBeaten = this.cardsBeaten || [];
    const cardsDestination = this.pickUpPlayerId // if pickup push cards to player
      ? player.cards : this.cardsBeaten; // else push cards to cardsBeaten
    this.cardsOffense.forEach((card) => cardsDestination.push(card));
    this.cardsDefense.forEach((card) => {
      if (card) cardsDestination.push(card); // only push defined/not null values
    });
    this.cardsOffense = [];
    this.cardsDefense = [];
  }

  _getAttackerIdx() {
    return this.players.findIndex(p => p.status === 'attacker');
  }

  _getDefenderIdx() {
    return this.players.findIndex(p => p.status === 'defender');
  }
}
