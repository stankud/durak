export default class Player {
  constructor({ id, cards = [], status }) {
    this.id = id;
    this.cards = cards;
    this.status = status;
  }

  toJSON() {
    const json = {};
    for (const prop in this) {
      if (prop === 'cards') {
        json[prop] = this[prop].map(card => card.toString())
      } else {
        json[prop] = this[prop];  
      }
    }
    return json;
  }

  doesHaveCard(card) {
    const hasCard = !!(this.cards.find(playerCard => playerCard.toString() === card.toString()));
    return { hasCard };
  }

  removeCard(card) {
    const result = { ok: false };
    const idx = this.cards.findIndex(playerCard => playerCard.toString() === card.toString());
    if (idx < 0 ) {
      result.message = `Unable to remomve non-exisitng card: ${card.toString()}`;
      return result;
    }
    this.cards.splice(idx, 1);
    result.ok = true;
    return result;
  }

  hasCards() {
    const hasCards = this.cards.length > 0;
    return { hasCards };
  }

  hasFullHand() {
    return this.cards.length >= 6;
  }
}
