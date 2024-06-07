// 需要扫描 icon 包的入口路径

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  statSync,
  writeFileSync
} from 'node:fs';
import nodePath from 'node:path';
import swc from '@swc/core';

const entry = [
  nodePath.resolve(
    __dirname,
    '..',
    '..',
    nodePath.join('packages', 'base', 'src', 'icon')
  ),
  nodePath.resolve(
    __dirname,
    '..',
    '..',
    nodePath.join('packages', 'shared', 'lib', 'icon')
  ),
  nodePath.resolve(
    __dirname,
    '..',
    '..',
    nodePath.join('packages', 'sqle', 'src', 'icon')
  )
];

const output = nodePath.resolve(__dirname, '..', 'dist');
const svgOutPut = nodePath.resolve(__dirname, '..', 'dist', 'svg');

const svgNames = [];

function scanIcon(rootPath) {
  if (statSync(rootPath).isDirectory()) {
    readdirSync(rootPath).forEach((path) => {
      scanIcon(nodePath.join(rootPath, path));
    });
  } else {
    parseFile(rootPath);
  }
}

function parseFile(path) {
  const ast = swc.parseFileSync(path, {
    syntax: 'typescript',
    tsx: true
  });

  ast.body.forEach((item) => {
    if (item.type === 'ExportDeclaration') {
      if (Array.isArray(item.declaration.declarations)) {
        const svgName = item.declaration.declarations[0].id.value;
        svgNames.push(svgName);
        if (
          item.declaration.declarations[0].init.type ===
          'ArrowFunctionExpression'
        ) {
          if (
            item.declaration.declarations[0].init.body.stmts[0].argument
              .expression.opening.name.value === 'svg'
          ) {
            const svgTag =
              item.declaration.declarations[0].init.body.stmts[0].argument
                .expression;
            const { viewBox, xmlns, pathAttr } = scanSvgAttr(svgTag);

            const svg = buildSvg(viewBox, xmlns, pathAttr, path);

            write(nodePath.join(svgOutPut, `${svgName}.svg`), svg);
          } else if (
            ['CommonIconStyleWrapper', 'span'].includes(
              item.declaration.declarations[0].init.body.stmts[0].argument
                .expression.opening.name.value
            )
          ) {
            const svgTag =
              item.declaration.declarations[0].init.body.stmts[0].argument.expression.children.find(
                (v) => v?.opening?.name?.value === 'svg'
              );
            const { viewBox, xmlns, pathAttr } = scanSvgAttr(svgTag);
            const svg = buildSvg(viewBox, xmlns, pathAttr, path);

            write(nodePath.join(svgOutPut, `${svgName}.svg`), svg);
          }
        }
      }
    }
  });
}

function scanSvgAttr(svgTag) {
  const viewBox =
    svgTag.opening.attributes.find((v) => v.name.value === 'viewBox')?.value
      ?.value ?? '0 0 16 16';
  const xmlns =
    svgTag.opening.attributes.find((v) => v.name.value === 'xmlns')?.value
      .value ?? 'http://www.w3.org/2000/svg';
  const pathAttr = svgTag.children
    .filter((v) => v.type === 'JSXElement')
    .map((v) => {
      return {
        d: v.opening.attributes.find((att) => att.name.value === 'd')?.value
          .value,
        fill: v.opening.attributes.find((att) => att.name.value === 'fill')
          ?.value.value
      };
    });

  return {
    viewBox,
    xmlns,
    pathAttr
  };
}

function buildSvg(viewBox, xmlns, pathAttr, path) {
  return `<!-- 所属路径: ${path} -->\n<svg viewBox="${viewBox}" xmlns="${xmlns}">${pathAttr
    .map(
      (attr) =>
        `<path d="${attr.d}" ${attr.fill ? `fill="${attr.fill}"` : ''} />`
    )
    .join('\n')}</svg>`;
}

function write(path, code) {
  if (existsSync(path)) {
    //处理可能存在的重复 icon
    const len = readdirSync(svgOutPut).filter((v) => v === path).length;
    path = `${path.split('.')[0]}-${len + 1}.svg`;
  }
  const dirs = nodePath.dirname(path);
  if (!existsSync(dirs)) {
    mkdirSync(dirs, { recursive: true });
  }
  writeFileSync(path, code);
}

function showAllIcons() {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>all icons playground</title>
    </head>
    <body>
      <style>
        .icon-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;

        }
        .icon-svg-name{
          font-weight: 600;
        }
      </style>
      ${readdirSync(svgOutPut)
        .map((v) => {
          return `<div class="icon-wrapper">
          <div class="icon-svg-name">${v.split('.')[0]}</div>
          <img src="../dist-back/svg/${
            v.split('.')[0]
          }.svg" width="50px" height="50px" />
        </div>`;
        })
        .join('\n')}
    </body>
  </html>
  
  `;

  const htmlPath = nodePath.resolve(__dirname, 'index.html');
  writeFileSync(htmlPath, htmlTemplate);
}

function main() {
  if (existsSync(output)) {
    rmdirSync(output, { recursive: true });
  }
  entry.forEach((dirPath) => {
    scanIcon(dirPath);
  });
  const svgPathNames = readdirSync(svgOutPut);
  console.log(
    `ast length: ${svgNames.length}, svg length: ${svgPathNames.length}`
  );
  const json = svgPathNames.reduce((acc, cur) => {
    return [
      ...acc,
      {
        originSvgName: cur.split('.')[0],
        originPath: readFileSync(nodePath.join(svgOutPut, cur), 'utf-8')
          .split('\n')[0]
          .match(new RegExp('<!-- 所属路径: (.*) -->'), '')[1],
        currentPath: nodePath.join(svgOutPut, cur),
        name: '',
        style: ''
      }
    ];
  }, []);
  write(
    nodePath.resolve(__dirname, '..', 'dist', 'meta.json'),
    JSON.stringify(json, undefined, 2)
  );
  showAllIcons();
}

main();
