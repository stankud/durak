import moves from '../../../lib/moves';

const isEndAttack = (curState, newState) => {
  return newState.endAttack && (curState.endAttack !== newState);
};
const isThrowIn = (curState, newState) => {
  return (
    (curState.cardsOffense.length > 0) &&
    (curState.cardsOffense.length + 1 === newState.cardsOffense.length) &&
    (curState.cardsPlayer.length - 1 === newState.cardsPlayer.length)
  );
};
const isAttack = (curState, newState) => {
  return (
    (curState.cardsOffense.length === 0) &&
    (curState.cardsOffense.length + 1 === newState.cardsOffense.length) &&
    (curState.cardsPlayer.length - 1 === newState.cardsPlayer.length)
  );
};
const isDefend = (curState, newState) => {
  return (
    (curState.cardsOffense.length > 0) &&
    (curState.cardsDefense.length + 1 === newState.cardsDefense.length) &&
    (curState.cardsPlayer.length - 1 === newState.cardsPlayer.length)
  );
};
const isPickUp = (curState, newState) => {
  return (
    (curState.cardsOffense.length > 0) &&
    (newState.cardsOffense.length === 0) &&
    (newState.cardsDefense.length === 0) &&
    (curState.cardsOffense.length +
      curState.cardsDefense.length +
      curState.cardsPlayer.length === newState.cardsPlayer.length)
  );
};

export default (curState, newState) => {
  let move;
  if (isEndAttack(curState, newState)) move = moves[3];
  else if (isThrowIn(curState, newState)) move = moves[2];
  else if (isAttack(curState, newState)) move = moves[0];
  else if (isDefend(curState, newState)) move = moves[1];
  else if (isPickUp(curState, newState)) move = moves[4];
  return move;
};
