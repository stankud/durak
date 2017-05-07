import dealer from './dealer';
import clone from './clone';

const isRoundOver = () => {};
const mergePlayerState = (cgs, nps) => {
  const ngs = clone(cgs);

};

export default (cgs, nps) => { // current game state, new player state
  let ret;
  let newState;
  const { result, move } = dealer.isValidStateUpdate(cgs, nps);
  if (result !== 'Ok') ret = { result: 'InvalidStateUpdate' };
  else if (['attack', 'throw-in', 'defend'].indexOf(move) > -1) {
    newState = mergePlayerState(newState, nps);
    newState = dealer.updateLegalMoves({ cgs, nps });
    ret = { result: 'Ok',  newState };
  }
  return ret;
};
