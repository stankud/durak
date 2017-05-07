import test from 'tape';
import Player from '.';

test('Player', (t) => {
  const id = 'id';
  const player = new Player({ id });
  t.is(player.id, id, 'has an id');
  t.true(Array.isArray(player.cards), 'has cards Array');
  t.end();
});