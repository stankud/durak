import returnHigherRank from './return-higher-rank';

const isSameSuit = (cO, cD) => cO[1] === cD[1];
const isTrump = (c, t) => c[1] === t[1];

export default ({ cardOffense, cardDefense, trump }) => {
  if (isSameSuit(cardOffense, cardDefense)) {
    const higherCard = returnHigherRank(cardOffense, cardDefense);
    return higherCard === cardDefense;
  }
  return isTrump(cardDefense, trump);
};
