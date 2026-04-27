// Genera todos los iconos PWA desde el isotipo de la marca.
//
// Uso:
//   npm run icons:generate
//
// Lee la imagen de origen (en orden de preferencia):
//   1) client/public/icons/source.png   (recomendado: PNG 1024×1024 o más)
//   2) client/src/assets/isotipo.png
//   3) client/src/assets/isotipo.ico    (extrae el layer más grande)
//
// Genera en client/public/icons/:
//   - icon-192.png            (192×192, "any")
//   - icon-512.png            (512×512, "any")
//   - icon-maskable-192.png   (192×192, "maskable" — con padding fondo color marca)
//   - icon-maskable-512.png   (512×512, "maskable")
//   - apple-touch-icon.png    (180×180, iOS home screen)
//   - favicon-32.png / favicon-16.png

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'icons');

const BRAND_COLOR = { r: 144, g: 83, b: 97 };   // #905361
const BG_LIGHT    = { r: 247, g: 242, b: 239 }; // #F7F2EF

const candidates = [
    path.join(ROOT, 'public', 'icons', 'source.png'),
    path.join(ROOT, 'src', 'assets', 'isotipo.png'),
    path.join(ROOT, 'src', 'assets', 'isotipo.ico')
];

async function readSource() {
    for (const p of candidates) {
        if (!fs.existsSync(p)) continue;
        if (p.endsWith('.ico')) {
            const decodeIco = require('decode-ico');
            const buf = fs.readFileSync(p);
            const layers = decodeIco(buf);
            // Pick the largest layer
            const largest = layers.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
            console.log(`> Usando layer ${largest.width}×${largest.height} de ${path.basename(p)}`);
            // decode-ico returns { width, height, data, type }
            // For PNG type, data is a Buffer with PNG bytes; for BMP, raw RGBA
            if (largest.type === 'png') return { input: largest.data, width: largest.width, height: largest.height };
            // BMP/raw → wrap in sharp from raw RGBA
            return {
                input: await sharp(Buffer.from(largest.data), {
                    raw: { width: largest.width, height: largest.height, channels: 4 }
                }).png().toBuffer(),
                width: largest.width,
                height: largest.height
            };
        }
        console.log(`> Usando ${path.relative(ROOT, p)}`);
        return { input: fs.readFileSync(p) };
    }
    throw new Error('No encontré ninguna fuente de icono. Coloca un PNG en client/public/icons/source.png (idealmente 1024×1024).');
}

async function ensureOut() {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function generateAny(source, size, filename) {
    // "any": el icono centrado en cuadrado sobre el fondo de la marca cremoso
    // (Windows/macOS no aceptan bien transparencias para iconos del escritorio).
    // Lanczos3 + sharpen suave para que se vea nítido aún subiendo de 256 a 512.
    const inner = Math.round(size * 0.86);
    const offset = Math.round((size - inner) / 2);
    const inset = await sharp(source)
        .resize(inner, inner, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
            kernel: sharp.kernel.lanczos3
        })
        .sharpen({ sigma: 0.6 })
        .png()
        .toBuffer();

    await sharp({
        create: {
            width: size, height: size, channels: 4,
            background: { ...BG_LIGHT, alpha: 1 }
        }
    })
        .composite([{ input: inset, top: offset, left: offset }])
        .png({ compressionLevel: 9 })
        .toFile(path.join(OUT_DIR, filename));
    console.log(`  ✓ ${filename}`);
}

async function generateMaskable(source, size, filename) {
    // "maskable": el icono debe ocupar el 80% central; el 10% de cada lado puede
    // ser recortado por la máscara del sistema. Pintamos fondo de la marca.
    const inner = Math.round(size * 0.8);
    const offset = Math.round((size - inner) / 2);
    const inset = await sharp(source)
        .resize(inner, inner, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
            kernel: sharp.kernel.lanczos3
        })
        .sharpen({ sigma: 0.6 })
        .png()
        .toBuffer();

    await sharp({
        create: {
            width: size, height: size, channels: 4,
            background: { ...BRAND_COLOR, alpha: 1 }
        }
    })
        .composite([{ input: inset, top: offset, left: offset }])
        .png()
        .toFile(path.join(OUT_DIR, filename));
    console.log(`  ✓ ${filename}`);
}

async function generateAppleTouch(source) {
    // Apple recomienda 180×180 con fondo opaco (sin transparencia, color marca claro).
    const inner = Math.round(180 * 0.85);
    const offset = Math.round((180 - inner) / 2);
    const inset = await sharp(source)
        .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    await sharp({
        create: {
            width: 180, height: 180, channels: 4,
            background: { ...BG_LIGHT, alpha: 1 }
        }
    })
        .composite([{ input: inset, top: offset, left: offset }])
        .png()
        .toFile(path.join(OUT_DIR, 'apple-touch-icon.png'));
    console.log('  ✓ apple-touch-icon.png');
}

async function generateFavicons(source) {
    for (const size of [16, 32]) {
        await sharp(source)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(path.join(OUT_DIR, `favicon-${size}.png`));
        console.log(`  ✓ favicon-${size}.png`);
    }
}

(async () => {
    try {
        await ensureOut();
        const { input } = await readSource();

        console.log('Generando iconos PWA...');
        await generateAny(input, 192, 'icon-192.png');
        await generateAny(input, 512, 'icon-512.png');
        await generateMaskable(input, 192, 'icon-maskable-192.png');
        await generateMaskable(input, 512, 'icon-maskable-512.png');
        await generateAppleTouch(input);
        await generateFavicons(input);

        console.log('\nListo. Iconos generados en client/public/icons/');
        console.log('Si los iconos se ven pixelados, sube un PNG cuadrado de al menos 512×512 a:');
        console.log('  client/public/icons/source.png');
        console.log('y vuelve a ejecutar: npm run icons:generate');
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
