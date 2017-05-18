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

test.only('Game._loadSavedGame()', (t) => {
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
  t.is(game.id, savedGame.id, 'has an id');
  t.is(game.players[0].id, savedGame.players[0].id);
  t.true(game.trumpCard, 'has a trumpCard prop');
  t.true(game.round, 'has a round prop');
  t.true(game.deck instanceof Deck, 'has a deck');
  t.true(game.lowestTrump.player instanceof Player, 'has a lowest trump player');
  t.true(game.lowestTrump.card instanceof Card, 'has a lowest trump card');
  t.end();
});