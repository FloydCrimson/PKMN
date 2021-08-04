const path = require('path');
const fs = require('fs');

const argv = process.argv.slice(2);

const dirRootJSON = argv[0];
const dirRootTS = argv[1];
const space = '    ';

console.log('[json-ts-mapper] dirRootJSON:\t' + dirRootJSON);
console.log('[json-ts-mapper] dirRootTS:\t' + dirRootTS);

findJSON(dirRootJSON);

// FUNCTION

function findJSON(dirJSON) {
    const exists = fs.existsSync(dirJSON);
    if (exists) {
        const files = fs.readdirSync(dirJSON, { encoding: 'utf8', withFileTypes: true });
        let dataIndex = '';
        for (const file of files) {
            if (file.isDirectory() && !file.isFile()) {
                dataIndex += findJSON(path.join(dirJSON, file.name));
            } else if (file.isFile() && !file.isDirectory()) {
                const pathJSON = path.join(dirJSON, file.name);
                const pathTS = path.join(dirRootTS, dirJSON.replace(dirRootJSON, ''), file.name.split('.').slice(0, -1).join('') + '.ts');
                dataIndex += mapJSON(pathJSON, pathTS);
            }
        }
        if (dataIndex) {
            const pathIndex = path.join(dirRootTS, dirJSON.replace(dirRootJSON, ''), 'index.ts');
            fs.writeFileSync(pathIndex, dataIndex, { encoding: 'utf8' });
            console.log('[json-ts-mapper] created:\t' + pathIndex);
            const name = dirJSON.split('\\').pop();
            return `export * as ${toCamelCase(name)} from './${name}';\n`;
        }
    }
    return '';
}

function mapJSON(pathJSON, pathTS) {
    const exists = fs.existsSync(pathJSON);
    if (exists) {
        console.log('[json-ts-mapper] creating:\t' + pathJSON);
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
            console.log('[json-ts-mapper] added block:\t' + name);
        }
        const dirTS = path.dirname(pathTS);
        fs.mkdirSync(dirTS, { recursive: true, });
        fs.writeFileSync(pathTS, dataTS, { encoding: 'utf8' });
        console.log('[json-ts-mapper] created:\t' + pathTS);
        const name = pathTS.split('\\').pop().split('.').slice(0, -1)[0];
        return `export * as ${toCamelCase(name)} from './${name}';\n`;
    }
    return '';
}

function mapJSONWithBlock(name, sprite) {
    let dataTS = '';
    // TITLE
    dataTS += `\n// ${name.toUpperCase()} - BLOCK\n`;
    // BLOCK PARTIAL
    dataTS += `\nconst ${name}SpriteCoorOptionPartial: Omit<SpriteCoorOption['block'], 'i'> = { s_w: ${sprite.data.sprite_width}, s_h: ${sprite.data.sprite_height}, b_w: ${sprite.data.block_width}, b_h: ${sprite.data.block_height} };\n`;
    // ARRAY
    dataTS += `\nexport const ${name} = {\n`;
    Object.entries(sprite.data.array).sort(([i1,], [i2,]) => parseInt(i1) - parseInt(i2)).forEach(([index, image], i, a) => {
        dataTS += `${space}${image}: { ...SpritePartial, s_c: SpriteService.getSpriteCoor('block', { ...${name}SpriteCoorOptionPartial, i: ${parseInt(index)} }) } as Sprite${(i < a.length - 1) ? ',' : ''}\n`;
    });
    dataTS += `};\n`;
    //
    return dataTS;
}

// SUPPORT

function toCamelCase(s) {
    return s.split(/-|_|\./).filter((s) => s).map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase()).join('');
}
