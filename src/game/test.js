import test from 'tape';
import Game from '.';
import Player from '../player';
import Card from '../card';
import Deck from '../deck';

test('Game._createNewGame()', (t) => {
  const id = 'id';
  const playerIds = ['id1', 'id2'];
  const game = new Game({ id, playerIds });
  t.is(game.id, id, 'has an id');
  t.is(game.players.length, 2, 'has 2 players');
  t.is(game.players[0].id, playerIds[0]);
  t.true(game.trumpCard, 'has a trumpCard prop');
  t.true(game.round, 'has a round prop');
  t.true(game.deck instanceof Deck, 'has a deck');
  t.true(game.lowestTrumpPlayerId, 'has a lowest trump player');
  t.true(game.lowestTrumpCard instanceof Card, 'has a lowest trump card');
  t.end();
});

test('Game._loadSavedGame()', (t) => {
  const savedGame = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D'],
    cardsDefense: ['QD'],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS', 'QH'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H', 'KH'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame });
  t.is(game.id, savedGame.id, 'loads correct id prop');
  t.is(game.round, savedGame.round, 'loads correct round prop');
  t.is(game.players[0].id, savedGame.players[0].id, 'loads correct player 1 id');
  t.is(game.players[1].id, savedGame.players[1].id, 'loads correct player 2 id');
  t.is(game.players[2].id, savedGame.players[2].id, 'loads correct player 3 id');
  t.is(game.players[3].id, savedGame.players[3].id, 'loads correct player 4 id');
  t.is(game.deck.cards.length, savedGame.deck.length, 'loads with correct amount of cards');
  t.true(game.deck instanceof Deck, 'deck is instance of Deck Class');
  t.true(game.players[0] instanceof Player, 'player 1 is instance of Player Class');
  t.true(game.players[1] instanceof Player, 'player 2 is instance of Player Class');
  t.true(game.players[2] instanceof Player, 'player 3 is instance of Player Class');
  t.true(game.players[3] instanceof Player, 'player 4 is instance of Player Class');
  t.is(game.lowestTrumpPlayerId, savedGame.lowestTrumpPlayerId, 'has a lowest trump player');
  t.true(game.trumpCard instanceof Card, 'has a trump card');
  t.true(game.lowestTrumpCard instanceof Card, 'has a lowest trump card');
  t.end();
});

test('Game.toJSON()', (t) => {
  const gameJSON = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D'],
    cardsDefense: ['QD'],
    endAttackPlayerIdList: [],
    pickUpPlayerId: null,
    cardsBeaten: [],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS', 'QH'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H', 'KH'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame: gameJSON });
  t.deepEqual(game.toJSON(), gameJSON, 'returns correct JSON');
  t.end();
});

test('Game.makeMove() throw-in', (t) => {
  const gameBefore = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D'],
    cardsDefense: ['QD'],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS', 'QH'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H', 'KH'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const move = {
    playerId: 'id1',
    type: 'throw-in',
    card: 'QH'
  };
  const gameAfter = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D', 'QH'],
    cardsDefense: ['QD'],
    endAttackPlayerIdList: [],
    pickUpPlayerId: null,
    cardsBeaten: [],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H', 'KH'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame: gameBefore });
  const { ok, message } = game.makeMove({ move });
  t.true(ok, 'result is ok');
  t.is(message, undefined, 'no message is returned');
  t.is(game.cardsOffense[1].toString(), move.card, 'card was moved to cardsOffense');
  const player = game._getPlayerById(move.playerId);
  t.is(player.cards.length, 5, 'player has 1 less card');
  const card = player.cards.find((playerCard) => playerCard.toString() === move.card );
  t.is(card, undefined, 'player no longer has the card');
  t.deepEqual(game.toJSON(), gameAfter, 'correct game JSON');
  t.end();
});

test('Game.makeMove() defend', (t) => {
  const gameBefore = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D', 'QH'],
    cardsDefense: ['QD'],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H', 'KH'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const move = {
    playerId: 'id4',
    type: 'defend',
    card: 'KH',
    cardOffense: 'QH'
  };
  const gameAfter = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D', 'QH'],
    cardsDefense: ['QD', 'KH'],
    endAttackPlayerIdList: [],
    pickUpPlayerId: null,
    cardsBeaten: [],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame: gameBefore });
  const { ok, message } = game.makeMove({ move });
  t.true(ok, 'result is ok');
  t.is(game.cardsDefense[1].toString(), move.card, 'card was moved to cardsDefense');
  const player = game._getPlayerById(move.playerId);
  t.is(player.cards.length, 4, 'player has 1 less card');
  const card = player.cards.find((playerCard) => playerCard.toString() === move.card );
  t.is(card, undefined, 'player no longer has the card');
  t.deepEqual(game.toJSON(), gameAfter, 'correct game JSON');
  t.end();
});

test('Game.makeMove() end-attack', (t) => {
  const gameBefore = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D', 'QH'],
    cardsDefense: ['QD', 'KH'],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const move = {
    playerId: 'id1',
    type: 'end-attack'
  };
  const gameAfter = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D', 'QH'],
    cardsDefense: ['QD', 'KH'],
    endAttackPlayerIdList: ['id1'],
    pickUpPlayerId: null,
    cardsBeaten: [],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame: gameBefore });
  const { ok, message } = game.makeMove({ move });
  t.true(ok, 'result is ok');
  t.deepEqual(game.toJSON(), gameAfter, 'correct game JSON');
  t.end();
});

test('Game.makeMove() end-attack and end round', (t) => {
  const gameBefore = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD', 'JC', '9S', '8C', 'AH'],
    cardsOffense: ['8D', 'QH'],
    cardsDefense: ['QD', 'KH'],
    endAttackPlayerIdList: ['id1', 'id2', 'id3'],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      status: 'attacker'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H'],
      status: 'defender'
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const move = {
    playerId: 'id4',
    type: 'end-attack'
  };
  const gameAfter = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD'],
    cardsOffense: [],
    cardsDefense: [],
    cardsBeaten: ['8D', 'QH', 'QD', 'KH'],
    pickUpPlayerId: null,
    endAttackPlayerIdList: [],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS', '8C'],
      status: 'defender'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S', 'AH'],
      status: 'thrower'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H', '9S', 'JC'],
      status: 'attacker'
    }],
    trumpCard: '8S',
    round: 2,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame: gameBefore });
  const { ok, message } = game.makeMove({ move });
  t.true(ok, 'result is ok');
  t.is(game.round, 2, 'round incremented');
  t.is(game.cardsOffense.length, 0, 'cardsOffense reset');
  t.is(game.cardsDefense.length, 0, 'cardsDefense reset');
  t.deepEqual(game.toJSON(), gameAfter, 'correct game JSON');
  t.end();
});

test('Game.makeMove() attack', (t) => {
  const gameBefore = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD'],
    cardsOffense: [],
    cardsDefense: [],
    cardsBeaten: ['8D', 'QH', 'QD', 'KH'],
    endAttackPlayerIdList: [],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS', '8C'],
      status: 'defender'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S', 'AH'],
      status: 'thrower'
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H', '9S', 'JC'],
      status: 'attacker'
    }],
    trumpCard: '8S',
    round: 2,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const move = {
    playerId: 'id4',
    type: 'attack',
    card: '6H'
  };
  const gameAfter = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD'],
    cardsOffense: ['6H'],
    cardsDefense: [],
    cardsBeaten: ['8D', 'QH', 'QD', 'KH'],
    endAttackPlayerIdList: [],
    pickUpPlayerId: null,
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS', '8C'],
      status: 'defender'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S', 'AH'],
      status: 'thrower'
    }, {
      id: 'id4',
      cards: ['TD', 'QC', '8H', '9S', 'JC'],
      status: 'attacker'
    }],
    trumpCard: '8S',
    round: 2,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame: gameBefore });
  const { ok, message } = game.makeMove({ move });
  t.true(ok, 'result is ok');
  t.is(message, undefined, 'no message returned');
  t.is(game.cardsOffense.length, 1, 'cardsOffense has 1 card');
  t.deepEqual(game.toJSON(), gameAfter, 'correct game JSON');
  t.end();
});

test('Game.makeMove() defend skip 1 card', (t) => {
  const gameBefore = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD'],
    cardsOffense: ['6H', '6S'],
    cardsDefense: [],
    cardsBeaten: ['8D', 'QH', 'QD', 'KH'],
    endAttackPlayerIdList: [],
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', 'KS', '8C'],
      status: 'defender'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', 'AH'],
      status: 'thrower'
    }, {
      id: 'id4',
      cards: ['TD', 'QC', '8H', '9S', 'JC'],
      status: 'attacker'
    }],
    trumpCard: '8S',
    round: 2,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const move = {
    playerId: 'id1',
    type: 'defend',
    card: 'KS',
    cardOffense: '6S'
  };
  const gameAfter = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD'],
    cardsOffense: ['6H', '6S'],
    cardsDefense: [, 'KS'],
    cardsBeaten: ['8D', 'QH', 'QD', 'KH'],
    endAttackPlayerIdList: [],
    pickUpPlayerId: null,
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', '7H', 'AC', '8C'],
      status: 'defender'
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', 'AH'],
      status: 'thrower'
    }, {
      id: 'id4',
      cards: ['TD', 'QC', '8H', '9S', 'JC'],
      status: 'attacker'
    }],
    trumpCard: '8S',
    round: 2,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame: gameBefore });
  const { ok, message } = game.makeMove({ move });
  t.true(ok, 'result is ok');
  t.is(message, undefined, 'no message returned');
  t.is(game.cardsOffense.length, 2, 'cardsOffense has correct card count');
  t.is(game.cardsDefense.length, 2, 'cardsDefense has correct card count');
  t.deepEqual(game.toJSON(), gameAfter, 'correct game JSON');
  t.end();
});

test.only('Game.makeMove() pick-up end-round', (t) => {
  const gameBefore = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS', '7S', 'AS', '6C', 'KC', 'JD'],
    cardsOffense: ['6H', '6S', '6D', '7C', '7D'],
    cardsDefense: ['7H'],
    cardsBeaten: ['8D', 'QH', 'QD', 'KH'],
    endAttackPlayerIdList: ['id3', 'id2', 'id4'],
    pickUpPlayerId: null,
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', 'AC', 'KS', '8C'],
      status: 'defender'
    }, {
      id: 'id2',
      cards: ['KD', 'TH', 'TC', 'QS'],
      status: 'thrower'
    }, {
      id: 'id3',
      cards: ['9H', 'TS', 'AD', 'AH'],
      status: 'thrower'
    }, {
      id: 'id4',
      cards: ['TD', 'QC', '8H', '9S', 'JC'],
      status: 'attacker'
    }],
    trumpCard: '8S',
    round: 2,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const move = {
    playerId: 'id1',
    type: 'pick-up'
  };
  const gameAfter = {
    id: 'gameId1',
    deck: ['8S', '9D', 'JS'],
    cardsOffense: [],
    cardsDefense: [],
    cardsBeaten: ['8D', 'QH', 'QD', 'KH'],
    endAttackPlayerIdList: [],
    pickUpPlayerId: null,
    players: [{
      id: 'id1',
      cards: ['9C', 'JH', 'AC', 'KS', '8C', '6H', '6S', '6D', '7C', '7D', '7H'],
      status: 'thrower'
    }, {
      id: 'id2',
      cards: ['KD', 'TH', 'TC', 'QS', 'KC', '6C'],
      status: 'attacker'
    }, {
      id: 'id3',
      cards: ['9H', 'TS', 'AD', 'AH', 'AS', '7S'],
      status: 'defender'
    }, {
      id: 'id4',
      cards: ['TD', 'QC', '8H', '9S', 'JC', 'JD'],
      status: 'thrower'
    }],
    trumpCard: '8S',
    round: 3,
    lowestTrumpCard: '6S',
    lowestTrumpPlayerId: 'id3'
  };
  const game = new Game({ savedGame: gameBefore });
  const { ok, message } = game.makeMove({ move });
  t.true(ok, 'result is ok');
  t.is(message, 'Round ended', 'message returned');
  t.is(game.round, 3, 'correct round');
  t.is(game.players[0].cards.length, 11, 'correct card count for player that picked-up');
  t.is(game.cardsOffense.length, 0, 'cardsOffense has correct card count');
  t.is(game.cardsDefense.length, 0, 'cardsDefense has correct card count');
  t.deepEqual(game.toJSON(), gameAfter, 'correct game JSON');
  t.end();
});
