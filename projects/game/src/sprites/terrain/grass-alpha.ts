import { Sprite, SpriteCoorOption, SpriteService } from '../../services/sprite.service';

const sprite_p: Omit<Sprite, 's_c'> = { l: 'assets/images/terrain/grass-alpha.png' };
const info_block_p: Omit<SpriteCoorOption['block'], 'i'> = { s_w: 32, s_h: 32, b_w: 3, b_h: 4 };

export const Full = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 0 }) } as Sprite;
export const TopLeft = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 3 }) } as Sprite;
export const TopMiddle = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 4 }) } as Sprite;
export const TopRight = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 5 }) } as Sprite;
export const CenterLeft = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 6 }) } as Sprite;
export const CenterMiddle = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 7 }) } as Sprite;
export const CenterRight = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 8 }) } as Sprite;
export const BottomLeft = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 9 }) } as Sprite;
export const BottomMiddle = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 10 }) } as Sprite;
export const BottomRight = { ...sprite_p, s_c: SpriteService.getSpriteCoor('block', { ...info_block_p, i: 11 }) } as Sprite;
