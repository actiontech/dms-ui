import { resolve } from 'path';
import { existsSync, copyFileSync } from 'fs';

const cwd = process.cwd();

const antdStyle = resolve(cwd, './node_modules/antd/dist');
const lightCss = resolve(antdStyle, './antd.min.css');
const lightCssMap = resolve(antdStyle, './antd.min.css.map');
const darkCss = resolve(antdStyle, './antd.dark.min.css');
const darkCssMap = resolve(antdStyle, './antd.dark.min.css.map');

const publicPath = resolve(cwd, './public/assets/css');

const pathSet = [lightCss, lightCssMap, darkCss, darkCssMap, publicPath];

for (const p of pathSet) {
  if (!existsSync(p)) {
    console.error(`not find file by ${p}`);
    process.exit(1);
  }
}

copyFileSync(lightCss, `${publicPath}/antd.min.css`);
copyFileSync(lightCssMap, `${publicPath}/antd.min.css.map`);
copyFileSync(darkCss, `${publicPath}/antd.dark.min.css`);
copyFileSync(darkCssMap, `${publicPath}/antd.dark.min.css.map`);
