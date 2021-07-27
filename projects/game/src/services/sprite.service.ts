import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SpriteService {

    //

    public static getSpriteCoor<O extends keyof SpriteCoorOption>(option: O, info: SpriteCoorOption[O]): SpriteCoor {
        switch (option) {
            case 'fixed': return SpriteService.getSpriteCoorFromFixed(info as SpriteCoorOption['fixed']);
            case 'block': return SpriteService.getSpriteCoorFromBlock(info as SpriteCoorOption['block']);
        }
        throw new Error('Parameter "option" not recognized:   ' + option);
    }

    public static getSpriteCollectionCoor<O extends keyof SpriteCollectionCoorOption>(option: O, info: SpriteCollectionCoorOption[O]): SpriteCoor[] {
        switch (option) {
            case 'array': return SpriteService.getSpriteCollectionCoorFromArray(info as SpriteCollectionCoorOption['array']);
        }
        throw new Error('Parameter "option" not recognized:   ' + option);
    }

    //

    private static getSpriteCoorFromFixed(info: SpriteCoorOption['fixed']): SpriteCoor {
        return {
            x: info.x,
            y: info.y,
            w: info.w,
            h: info.h
        };
    }

    private static getSpriteCoorFromBlock(info: SpriteCoorOption['block']): SpriteCoor {
        const x = info.i % info.b_w;
        const y = (info.i - x) / info.b_w;
        return {
            x: x * info.s_w,
            y: y * info.s_h,
            w: info.s_w,
            h: info.s_h
        };
    }

    private static getSpriteCollectionCoorFromArray(info: SpriteCollectionCoorOption['array']): SpriteCoor[] {
        const a = new Array<SpriteCoor>(info.l);
        for (let i = 0; i < info.l; i++) {
            a[i] = SpriteService.getSpriteCoorFromBlock({
                s_w: info.s_w,
                s_h: info.s_h,
                b_w: info.b_w,
                b_h: info.b_h,
                i
            });
        }
        return a;
    }

}

export interface Sprite {
    /** Image location */
    l: string;
    /** Sprite coordinates */
    s_c: SpriteCoor;
}

export interface SpriteCoor {
    /** Coordinate x */
    x: number;
    /** Coordinate y */
    y: number;
    /** Sprite width */
    w: number;
    /** Sprite height */
    h: number;
}

export interface SpriteCoorOption {
    /** Coordinate by fixed */
    fixed: {
        /** Coordinate x */
        x: number;
        /** Coordinate y */
        y: number;
        /** Sprite width */
        w: number;
        /** Sprite height */
        h: number;
    };
    /** Coordinate by block */
    block: {
        /** Sprite width */
        s_w: number;
        /** Sprite height */
        s_h: number;
        /** Block width */
        b_w: number;
        /** Block height */
        b_h: number;
        /** Sprite index */
        i: number;
    };
}

export interface SpriteCollectionCoorOption {
    /** Coordinate by block */
    array: {
        /** Sprite width */
        s_w: number;
        /** Sprite height */
        s_h: number;
        /** Block width */
        b_w: number;
        /** Block height */
        b_h: number;
        /** Array length */
        l: number;
    };
}
