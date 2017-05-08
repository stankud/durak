import test from 'tape';
import Game from '.';
import Player from '../player';
import Card from '../card';
import Deck from '../deck';

test('Game', (t) => {
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