import { CardData, Card } from '../card';
import { ATTR } from '../../const/const';

describe('Card', () => {
    describe('constructs', () => {
        let cardData: CardData;
        beforeEach(() => {
            cardData = {
                id: '10000',
                name: 'TestCard',
                level: 1,
                attribute: 0
            };
        });

        describe('id', () => {
            it('to 12345 when id data is 12345', () => {
                cardData.id = '12345';
                const card: Card = new Card(cardData);
                expect(card.id).toEqual('12345');
            });
        })

        describe('name', () => {
            it('to MutouYugi when id data is MutouYugi', () => {
                cardData.name = 'MutouYugi';
                const card: Card = new Card(cardData);
                expect(card.name).toEqual('MutouYugi');
            });
        })

        describe('level', () => {
            it('to 1 when level data is 1', () => {
                cardData.level = 1;
                const card: Card = new Card(cardData);
                expect(card.level).toEqual(1);
            });
            it('to 12 when level data is 12', () => {
                cardData.level = 12;
                const card: Card = new Card(cardData);
                expect(card.level).toEqual(12);
            });
            it('to 0 when level data is 15', () => {
                cardData.level = 12;
                const card: Card = new Card(cardData);
                expect(card.level).toEqual(12);
            });
            it('to 1 when level data is 16', () => {
                cardData.level = 12;
                const card: Card = new Card(cardData);
                expect(card.level).toEqual(12);
            });
            it('to 1 when level data is 27', () => {
                cardData.level = 12;
                const card: Card = new Card(cardData);
                expect(card.level).toEqual(12);
            });
        })

        describe('attribute', () => {
            it('to EARTH when attr data is [0x01 | earth | di]', () => {
                [0x01, 'earth', 'di'].forEach(attrData => {
                    cardData.attribute = attrData;
                    const card: Card = new Card(cardData);
                    expect(card.attribute).toBe(ATTR.EARTH);
                });
            });
            it('to WATER when attr data is [0x02 | water | shui]', () => {
                [0x02, 'water', 'shui'].forEach(attrData => {
                    cardData.attribute = attrData;
                    const card: Card = new Card(cardData);
                    expect(card.attribute).toBe(ATTR.WATER);
                });
            });
            it('to FIRE when attr data is [0x04 | fire | huo]', () => {
                [0x04, 'fire', 'huo'].forEach(attrData => {
                    cardData.attribute = attrData;
                    const card: Card = new Card(cardData);
                    expect(card.attribute).toBe(ATTR.FIRE);
                });
            });
            it('to WIND when attr data is [0x08 | wind | feng]', () => {
                [0x08, 'wind', 'feng'].forEach(attrData => {
                    cardData.attribute = attrData;
                    const card: Card = new Card(cardData);
                    expect(card.attribute).toBe(ATTR.WIND);
                });
            });
            it('to LIGHT when attr data is [0x10 | light | guang]', () => {
                [0x10, 'light', 'guang'].forEach(attrData => {
                    cardData.attribute = attrData;
                    const card: Card = new Card(cardData);
                    expect(card.attribute).toBe(ATTR.LIGHT);
                });
            });
            it('to DARK when attr data is [0x20 | dark | an]', () => {
                [0x20, 'dark', 'an'].forEach(attrData => {
                    cardData.attribute = attrData;
                    const card: Card = new Card(cardData);
                    expect(card.attribute).toBe(ATTR.DARK);
                });
            });
            it('to DIVINE when attr data is [0x40 | divine | shen]', () => {
                [0x40, 'divine', 'shen'].forEach(attrData => {
                    cardData.attribute = attrData;
                    const card: Card = new Card(cardData);
                    expect(card.attribute).toBe(ATTR.DIVINE);
                });
            });
            it('to DIVINE when attr data is not recognizable', () => {
                [0x80, 'monster', 'xyz', 'warrior'].forEach(attrData => {
                    cardData.attribute = attrData;
                    const card: Card = new Card(cardData);
                    expect(card.attribute).toBe(ATTR.DIVINE);
                });
            });
        });
    });
});