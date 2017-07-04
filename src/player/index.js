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
}
