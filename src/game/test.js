import test from 'tape';
import Game from '.';

test('Game', (t) => {
  const id = 'id';
  const game = new Game({ id });
  t.is(game.id, id, 'has an id');
  t.end();
});