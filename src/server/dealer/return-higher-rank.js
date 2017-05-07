import ranks from '../../lib/ranks';

export default ([r, s], [r2, s2]) => ranks[r] > ranks[r2] ? `${r}${s}` : `${r2}${s2}`;
