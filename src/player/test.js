import test from 'tape';
import Player from '.';
import Card from '../card';

test('Player', (t) => {
  const id = 'id';
  const status = 'attacker';
  const player = new Player({ id, status });
  t.is(player.id, id, 'has an id');
  t.is(player.status, status, 'has a status');
  t.true(Array.isArray(player.cards), 'has cards Array');
  t.end();
});

test('Player.toJSON()', (t) => {
  const card1 = new Card({ rank: 'A', suit: 'H' });
  const card2 = new Card({ rank: 'T', suit: 'S' });
  const playerJSON = {
    id: 'id',
    status: 'defender',
    cards: [card1.toString(), card2.toString()]
  };
  const player = new Player({
    id: playerJSON.id,
    status: playerJSON.status,
    cards: [card1, card2]
  });
  t.deepEqual(player.toJSON(), playerJSON, 'returns correct JSON');
  t.end();
});
