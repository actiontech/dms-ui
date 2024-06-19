import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeFirstLetterOfEachWord(str) {
  const words = str.split('-');
  for (let i = 0; i < words.length; i++) {
    words[i] = capitalizeFirstLetter(words[i]);
  }
  return words.join('');
}

function main() {
  const data = readFileSync('scripts/dist-back/meta.json', 'utf-8');
  const json = JSON.parse(data);
  json.forEach((icon) => {
    if (icon.name && icon.style && icon.feature) {
      const originSvg = readFileSync(
        `scripts/dist-back/svg/${icon.originSvgName}.svg`,
        'utf-8'
      );
      if (!existsSync(`packages/icons/svg/${icon.style}`)) {
        mkdirSync(`packages/icons/svg/${icon.style}`, { recursive: true });
      }

      if (!existsSync(`packages/icons/svg/${icon.style}/${icon.feature}`)) {
        mkdirSync(`packages/icons/svg/${icon.style}/${icon.feature}`, {
          recursive: true
        });
      }

      const filePath = `packages/icons/svg/${icon.style}/${
        icon.feature
      }/${capitalizeFirstLetterOfEachWord(
        icon.name
      )}${capitalizeFirstLetterOfEachWord(icon.style)}.svg`;

      writeFileSync(filePath, originSvg);
    }
  });
}

main();
