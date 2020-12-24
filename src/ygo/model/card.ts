import { observable } from 'mobx';
import { ATTR } from '../const/const';

export interface CardData {
    id: string;
    name: string;
    level: number;
    attribute: number | string;
}

export class Card {
    @observable id: string;
    @observable name: string;
    @observable level: number;
    @observable attribute: ATTR;

    constructor(data: CardData) {
        this.id = data.id;
        this.name = data.name;
        this.level = data.level;
        this.attribute = this.formatAttribute(data.attribute);
    }

    private formatLevel = (levelData: number): number => {
        const level = levelData & 0xF;
        return level <= 12 && level >= 0 ? level : 0;
    }

    private formatAttribute = (attrData: number | string): ATTR => {
        if(attrData === 0x01 || attrData === 'earth' || attrData === 'di') {
            return ATTR.EARTH;
        }
        if(attrData === 0x02 || attrData === 'water' || attrData === 'shui') {
            return ATTR.WATER;
        }
        if(attrData === 0x04 || attrData === 'fire' || attrData === 'huo') {
            return ATTR.FIRE;
        }
        if(attrData === 0x08 || attrData === 'wind' || attrData === 'feng') {
            return ATTR.WIND;
        }
        if(attrData === 0x10 || attrData === 'light' || attrData === 'guang') {
            return ATTR.LIGHT;
        }
        if(attrData === 0x20 || attrData === 'dark' || attrData === 'an') {
            return ATTR.DARK;
        }
        return ATTR.DIVINE;
    }


}