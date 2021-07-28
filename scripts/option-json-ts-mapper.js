const path = require('path');
const fs = require('fs');

const argv = process.argv.slice(2);

const dirRootJSON = argv[0];
const dirRootTS = argv[1];
const space = '    ';

console.log('[option-json-ts-mapper] dirRootJSON:\t' + dirRootJSON);
console.log('[option-json-ts-mapper] dirRootTS:\t' + dirRootTS);

findJSON(dirRootJSON);

// HELP

function findJSON(dirJSON) {
    const exists = fs.existsSync(dirJSON);
    if (exists) {
        const files = fs.readdirSync(dirJSON, { encoding: 'utf8', withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory() && !file.isFile()) {
                findJSON(path.join(dirJSON, file.name));
            } else if (file.isFile() && !file.isDirectory()) {
                const pathJSON = path.join(dirJSON, file.name);
                const pathTS = path.join(dirRootTS, dirJSON.replace(dirRootJSON, ''), file.name.split('.').slice(0, -1).join('') + '.ts');
                mapJSON(pathJSON, pathTS);
            }
        }
    }
}

function mapJSON(pathJSON, pathTS) {
    const exists = fs.existsSync(pathJSON);
    if (exists) {
        console.log('[option-json-ts-mapper] creating:\t' + pathJSON);
        let dataJSON = JSON.parse(fs.readFileSync(pathJSON, { encoding: 'utf8' }));
        let dataTS = '';
        // IMPORTS
        const depth = pathTS.replace(dirRootTS, '').split('\\').length - 1;
        dataTS += `import { Sprite, SpriteCoorOption, SpriteService } from '${'../'.repeat(depth)}services/sprite.service';\n\n`;
        // SPRITE PARTIAL
        const location = dataJSON.location;
        dataTS += `const SpritePartial: Omit<Sprite, 's_c'> = { l: '${location}' };\n`;
        for (const name in dataJSON.sprites) {
            const sprite = dataJSON.sprites[name];
            const type = sprite.type;
            switch (type) {
                case 'block': dataTS += mapJSONWithBlock(name, sprite); break;
            }
            console.log('[option-json-ts-mapper] added block:\t' + name);
        }
        const dirTS = path.dirname(pathTS);
        fs.mkdirSync(dirTS, { recursive: true, });
        fs.writeFileSync(pathTS, dataTS, { encoding: 'utf8' });
        console.log('[option-json-ts-mapper] created:\t' + pathTS);
    }
}

function mapJSONWithBlock(name, sprite) {
    let dataTS = '';
    // TITLE
    dataTS += `\n// ${name.toUpperCase()} - BLOCK\n`;
    // BLOCK PARTIAL
    dataTS += `\nconst ${name}SpriteCoorOptionPartial: Omit<SpriteCoorOption['block'], 'i'> = { s_w: ${sprite.data.sprite_width}, s_h: ${sprite.data.sprite_height}, b_w: ${sprite.data.block_width}, b_h: ${sprite.data.block_height} };\n`;
    // CELLS
    dataTS += `\nexport const ${name} = {\n`;
    Object.entries(sprite.data.cells).sort(([, p1], [, p2]) => p1 - p2).forEach(([cell, position], index, array) => {
        dataTS += `${space}${cell}: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...${name}SpriteCoorOptionPartial, i: ${position} }) } as Sprite${(index < array.length - 1) ? ',' : ''}\n`;
    });
    dataTS += `};\n`;
    //
    return dataTS;
}
