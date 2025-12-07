// Script pour generer les icones PWA a partir du SVG source
import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const svgBuffer = readFileSync(join(rootDir, "public/icons/icon.svg"));

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(rootDir, `public/icons/icon-${size}x${size}.png`));

    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Generer aussi favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(rootDir, "public/favicon.png"));

  // Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(rootDir, "public/apple-touch-icon.png"));

  console.log("Generated favicon.png and apple-touch-icon.png");
  console.log("Done!");
}

generateIcons().catch(console.error);

