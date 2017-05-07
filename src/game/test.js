import test from 'tape';
import Game from '.';

test('Game', (t) => {
  const id = 'id';
  const playerIds = ['id1', 'id2'];
  const game = new Game({ id, playerIds });
  t.is(game.id, id, 'has an id');
  t.is(game.players[0].id, playerIds[0]);
  t.end();
});