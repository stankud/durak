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
  if (isEndAttack(curState, newState)) return moves[3];
  if (isThrowIn(curState, newState)) return moves[2];
  if (isAttack(curState, newState)) return moves[0];
  if (isDefend(curState, newState)) return moves[1];
  if (isPickUp(curState, newState)) return moves[4];
  return null;
};
