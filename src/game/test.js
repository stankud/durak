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
  t.is(game.players[0].id, playerIds[0]);
  t.true(game.trumpCard, 'has a trumpCard prop');
  t.true(game.round, 'has a round prop');
  t.true(game.deck instanceof Deck, 'has a deck');
  t.true(game.lowestTrump.player instanceof Player, 'has a lowest trump player');
  t.true(game.lowestTrump.card instanceof Card, 'has a lowest trump card');
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
      legalMoves: ['throw-in']
    }, {
      id: 'id2',
      cards: ['KD', '7C', 'TH', 'TC', '6D', 'QS'],
      legalMoves: ['throw-in']
    }, {
      id: 'id3',
      cards: ['9H', '7D', 'TS', 'AD', '6S'],
      legalMoves: ['throw-in']
    }, {
      id: 'id4',
      cards: ['TD', '6H', 'QC', '8H', 'KH'],
      legalMoves: ['pick-up', 'defend']
    }],
    trumpCard: '8S',
    round: 1,
    lowestTrump: {
      card: '6S',
      player: 'id3'
    }
  };
  const game = new Game({ savedGame });
  t.is(game.id, savedGame.id, 'loads correct id prop');
  t.is(game.round, savedGame.round, 'loads correct round prop');
  t.is(game.players[0].id, savedGame.players[0].id, 'loads correct player 1 id');
  t.is(game.players[1].id, savedGame.players[1].id, 'loads correct player 2 id');
  t.is(game.players[2].id, savedGame.players[2].id, 'loads correct player 3 id');
  t.is(game.players[3].id, savedGame.players[3].id, 'loads correct player 4 id');
  t.true(game.deck instanceof Deck, 'deck is instance of Deck Class');
  t.true(game.players[0] instanceof Player, 'player 1 is instance of Player Class');
  t.true(game.players[1] instanceof Player, 'player 2 is instance of Player Class');
  t.true(game.players[2] instanceof Player, 'player 3 is instance of Player Class');
  t.true(game.players[3] instanceof Player, 'player 4 is instance of Player Class');
  t.true(game.lowestTrump.player instanceof Player, 'has a lowest trump player');
  t.true(game.trumpCard instanceof Card, 'has a trump card');
  t.true(game.lowestTrump.card instanceof Card, 'has a lowest trump card');
  t.end();
});