import {
  writeFileSync,
  existsSync,
  mkdirSync,
  appendFileSync,
  readdirSync,
  unlinkSync
} from 'node:fs';

const iconStyleType = ['filled', 'outlined'];

const iconFeatureType = {
  'Common': '通用类图标',
  'Data': '数据类图标',
  'Directional': '方向类图标',
  'Editorial': '编辑类图标',
  'Suggestive': '提示建议类图标'
};

const markDownTemp = `
---
nav:
  title: 图标
  order: 1
---
`;

function componentDemoTemp(name) {
  return `
## ${name}
\`\`\`jsx
import { ${name} } from '@actiontech/icons';

export default () => <${name} width={32} height={32} />
\`\`\`
`;
}

function main() {
  if (!existsSync('./docs/icon')) {
    mkdirSync('./docs/icon');
  }
  Object.keys(iconFeatureType).forEach((featureType) => {
    const markDownFile = `./docs/icon/${featureType}.md`;
    if (!existsSync(markDownFile)) {
      writeFileSync(markDownFile, markDownTemp.trimStart());
      appendFileSync(markDownFile, `# ${iconFeatureType[featureType]}`);
    } else {
      unlinkSync(markDownFile);
      writeFileSync(markDownFile, markDownTemp.trimStart());
      appendFileSync(markDownFile, `# ${iconFeatureType[featureType]}`);
    }
    if (existsSync(markDownFile)) {
      iconStyleType.forEach((styleType) => {
        const iconDir = `./src/${styleType}/${featureType}/`;
        if (existsSync(iconDir)) {
          const files = readdirSync(iconDir);
          files.forEach((file) => {
            const componentName = file.split('.')[0];
            if (componentName !== 'index') {
              appendFileSync(markDownFile, componentDemoTemp(componentName));
            }
          });
        }
      });
    }
  });
}

main();