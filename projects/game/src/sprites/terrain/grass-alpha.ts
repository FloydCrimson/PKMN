import { Sprite, SpriteCoorOption, SpriteService } from '../../services/sprite.service';

const SpritePartial: Omit<Sprite, 's_c'> = { l: '/terrain/grass-alpha.png' };

// BASE - BLOCK

const BaseSpriteCoorOptionPartial: Omit<SpriteCoorOption['block'], 'i'> = { s_w: 32, s_h: 32, b_w: 3, b_h: 4 };

export const Base = {
    Full: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 0 }) } as Sprite,
    TopLeft: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 3 }) } as Sprite,
    TopMiddle: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 4 }) } as Sprite,
    TopRight: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 5 }) } as Sprite,
    CenterLeft: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 6 }) } as Sprite,
    CenterMiddle: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 7 }) } as Sprite,
    CenterRight: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 8 }) } as Sprite,
    BottomLeft: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 9 }) } as Sprite,
    BottomMiddle: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 10 }) } as Sprite,
    BottomRight: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...BaseSpriteCoorOptionPartial, i: 11 }) } as Sprite
};
