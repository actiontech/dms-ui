import { readFile } from 'fs/promises';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { resolve } from 'path';
import { Writer } from './writer-utils';
import { PathUtils } from './path-utils';

interface IObjectValueBase {
  type:
    | 'literal'
    | 'identifier'
    | 'shorthand'
    | 'JSXElement'
    | 'function'
    | 'templateLiteral';
}

interface ILiteralValue extends IObjectValueBase {
  type: 'literal';
  value:
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<ObjectValue>
    | Record<string, ObjectValue>;
}

interface IIdentifierValue extends IObjectValueBase {
  type: 'identifier';
  name: string;
}

interface IShorthandValue extends IObjectValueBase {
  type: 'shorthand';
  name: string;
}

interface IJSXElementValue extends IObjectValueBase {
  type: 'JSXElement';
  name: string;
  attribute?: Array<{ name: string; value: ObjectValue }>;
  selfClosing?: boolean;
  children?: Array<ObjectValue>;
}

interface IFunctionValue extends IObjectValueBase {
  type: 'function';
  params?: ObjectValue[];
  functionName: string;
}

interface ITemplateLiteral extends IObjectValueBase {
  type: 'templateLiteral';
  quasis: Array<{ raw: string; tail: boolean }>;
  names: string[];
}

export type ObjectValue =
  | ILiteralValue
  | IIdentifierValue
  | IShorthandValue
  | IJSXElementValue
  | IFunctionValue
  | ITemplateLiteral;

interface IAddKeyOptions {
  filePath: string; // 文件路径
  objectName?: string; // 要修改的对象名称
  keyPath: string[]; // 要添加的键路径
  value: ObjectValue; // 要添加的值
  isDefaultExportObject?: boolean;
}

interface IAddItemOptions {
  filePath: string; // 文件路径
  variableName: string; // 要修改的对象名称
  value: ObjectValue; // 要添加的值
}

interface IUpdateImportOptions {
  // 要添加 import 语句的文件路径
  filePath: string;
  // 要导入的模块名称或路径
  moduleSpecifier: string;

  specifiers: string[];
}

interface IAddDefaultImportOptions {
  // 要添加 import 语句的文件路径
  filePath: string;
  // 要导入的模块名称或路径
  moduleSpecifier: string;
  // 默认导入的名称
  defaultImport: string;
}

interface IAddReactLoaderComponentDeclarationOptions {
  filePath: string; // 文件路径
  componentName: string; //组件名称
  importPath: string; //导入路径
}

interface IAddMenuItemVariableOptions {
  filePath: string; // 文件路径
  value: ObjectValue; // 要添加的值
  variableName: string; //菜单变量名
}

interface IAddStringLiteralOptions {
  filePath: string;
  typeName: string;
  stringLiteral: string;
}

export class BabelUtils {
  static async addKeyToObject(options: IAddKeyOptions) {
    const { filePath, objectName, keyPath, value, isDefaultExportObject } =
      options;

    const ast = await this.fileCodeToAst(filePath);

    const valueNode = this.valueToAst(value);

    let targetObjectFound = false;

    const addKeyWithObjectExpression = (currentObject: t.ObjectExpression) => {
      for (let i = 0; i < keyPath.length - 1; i++) {
        const key = keyPath[i];
        let nestedObject = currentObject.properties.find(
          (prop): prop is t.ObjectProperty =>
            t.isObjectProperty(prop) &&
            ((t.isIdentifier(prop.key) && prop.key.name === key) ||
              (t.isStringLiteral(prop.key) && prop.key.value === key))
        );

        if (!nestedObject) {
          nestedObject = t.objectProperty(
            t.identifier(key),
            t.objectExpression([])
          );
          currentObject.properties.push(nestedObject);
        }

        currentObject = nestedObject.value as t.ObjectExpression;
      }

      const lastKey = keyPath[keyPath.length - 1];

      if (
        currentObject.properties.some((item) => {
          return (
            t.isObjectProperty(item) &&
            t.isIdentifier(item.key) &&
            item.key.name === lastKey
          );
        })
      ) {
        throw new Error(
          `当前对象 ${objectName} 存在对象路径为 [${keyPath.join(
            ','
          )}] 的值，无法重复添加！`
        );
      }
      currentObject.properties.push(
        t.objectProperty(
          t.identifier(lastKey),
          valueNode,
          false,
          value.type === 'shorthand'
        )
      );
    };

    traverse(ast, {
      VariableDeclaration(path) {
        const declaration = path.node.declarations[0];

        if (
          t.isIdentifier(declaration.id) &&
          declaration.id.name === objectName
        ) {
          targetObjectFound = true;

          if (t.isTSAsExpression(declaration.init)) {
            const objectExpression = declaration.init;
            const currentObject =
              objectExpression.expression as t.ObjectExpression;
            addKeyWithObjectExpression(currentObject);
          }
        }
      },
      ExportDefaultDeclaration(path) {
        if (isDefaultExportObject) {
          targetObjectFound = true;
          const declaration = path.node.declaration;

          if (t.isObjectExpression(declaration)) {
            addKeyWithObjectExpression(declaration);
          }
        }
      }
    });

    if (!targetObjectFound) {
      throw new Error(`Object "${objectName}" not found in ${filePath}`);
    }

    await this.formattedWriteFileCodeWithAst(ast, filePath);
  }

  static async addItemToArray(options: IAddItemOptions) {
    const { filePath, variableName, value } = options;

    const ast = await this.fileCodeToAst(filePath);

    const valueNode = this.valueToAst(value);

    let targetObjectFound = false;

    traverse(ast, {
      VariableDeclaration(path) {
        const declaration = path.node.declarations[0];

        if (
          t.isIdentifier(declaration.id) &&
          declaration.id.name === variableName
        ) {
          targetObjectFound = true;

          if (t.isArrayExpression(declaration.init)) {
            const arrayExpression = declaration.init;
            arrayExpression.elements.push(valueNode);
          }
        }
      }
    });

    if (!targetObjectFound) {
      throw new Error(`Array "${variableName}" not found in ${filePath}`);
    }

    await this.formattedWriteFileCodeWithAst(ast, filePath);
  }

  private static transformJSXAttributes(
    attributes: IJSXElementValue['attribute']
  ): Array<t.JSXAttribute> {
    if (!attributes) {
      return [];
    }

    return attributes.map((item) => {
      return t.jSXAttribute(
        t.jsxIdentifier(item.name),
        t.jsxExpressionContainer(this.valueToAst(item.value))
      );
    });
  }
  private static transformJSXChildren(children: IJSXElementValue['children']) {
    if (!children) {
      return [];
    }
    return children.map((item) =>
      t.jsxExpressionContainer(this.valueToAst(item))
    );
  }

  private static valueToAst(value: ObjectValue): t.Expression {
    switch (value.type) {
      case 'literal':
        // 处理字面量
        if (value.value === null) {
          return t.nullLiteral();
        }
        if (value.value === undefined) {
          return t.identifier('undefined');
        }
        if (typeof value.value === 'string') {
          return t.stringLiteral(value.value);
        }
        if (typeof value.value === 'number') {
          return t.numericLiteral(value.value);
        }
        if (typeof value.value === 'boolean') {
          return t.booleanLiteral(value.value);
        }
        if (typeof value.value === 'object') {
          const properties = Object.entries(value.value).map(([key, val]) =>
            t.objectProperty(t.identifier(key), this.valueToAst(val), false)
          );
          return t.objectExpression(properties);
        }
        throw new Error(`Unsupported literal type: ${typeof value.value}`);

      case 'identifier':
        // 处理变量引用
        return t.identifier(value.name);

      case 'shorthand':
        // shorthand 属性在 ObjectProperty 中特殊处理
        return t.identifier(value.name);

      case 'function':
        return t.callExpression(
          t.identifier(value.functionName),
          value.params ? value.params.map((item) => this.valueToAst(item)) : []
        );

      case 'templateLiteral':
        return t.templateLiteral(
          value.quasis.map((item) =>
            t.templateElement({ raw: item.raw }, item.tail)
          ),
          value.names.map((item) => t.identifier(item))
        );

      case 'JSXElement':
        return t.jSXElement(
          {
            type: 'JSXOpeningElement',
            name: t.jsxIdentifier(value.name),
            attributes: this.transformJSXAttributes(value.attribute),
            selfClosing: !!value.selfClosing
          },
          !value.selfClosing
            ? t.jsxClosingElement(t.jsxIdentifier(value.name))
            : null,
          this.transformJSXChildren(value.children)
        );

      default:
        throw new Error(`Unsupported value type: ${(value as any).type}`);
    }
  }

  private static async fileCodeToAst(filePath: string) {
    const code = await readFile(resolve(filePath), 'utf-8');

    return parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });
  }

  private static async formattedWriteFileCodeWithAst(
    ast: parser.ParseResult<t.File>,
    filePath: string
  ) {
    const output = generate(ast, {
      retainLines: true,
      compact: false,
      filename: filePath,
      jsescOption: {
        minimal: true
      }
    }).code;

    await Writer.formattedWriteFile(filePath, output, PathUtils.DMS_ROOT_CWD);
  }

  static async updateImportDeclaration(options: IUpdateImportOptions) {
    const { filePath, moduleSpecifier, specifiers } = options;

    const ast = await this.fileCodeToAst(filePath);

    traverse(ast, {
      Program(path) {
        const currentImportIsExisting = path.node.body.some((item) => {
          if (
            t.isImportDeclaration(item) &&
            item.source.value === moduleSpecifier
          ) {
            specifiers.forEach((specifier) => {
              item.specifiers.push(
                t.importSpecifier(
                  t.identifier(specifier),
                  t.identifier(specifier)
                )
              );
            });
            return true;
          }
          return false;
        });

        if (!currentImportIsExisting) {
          path.node.body.unshift(
            t.importDeclaration(
              specifiers.map((item) =>
                t.importSpecifier(t.identifier(item), t.identifier(item))
              ),
              t.stringLiteral(moduleSpecifier)
            )
          );
        }
      }
    });

    await this.formattedWriteFileCodeWithAst(ast, filePath);
  }

  static async addImportDefaultDeclaration(options: IAddDefaultImportOptions) {
    const { filePath, moduleSpecifier, defaultImport } = options;

    const ast = await this.fileCodeToAst(filePath);

    traverse(ast, {
      Program(path) {
        const currentDefaultImportIsExisting = path.node.body.some((item) => {
          if (t.isImportDeclaration(item)) {
            return item.source.value === moduleSpecifier;
          }
          return false;
        });

        if (!currentDefaultImportIsExisting) {
          path.node.body.unshift(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(defaultImport))],
              t.stringLiteral(moduleSpecifier)
            )
          );
        }
      }
    });

    await this.formattedWriteFileCodeWithAst(ast, filePath);
  }

  static async addReactLoaderComponentDeclaration(
    options: IAddReactLoaderComponentDeclarationOptions
  ) {
    const { filePath, componentName, importPath } = options;

    const ast = await this.fileCodeToAst(filePath);
    let lastConstDeclaration = null;

    traverse(ast, {
      VariableDeclaration(path) {
        //todo 校验 componentName 是否已经定义

        //找到最后一个 const + React.lazy 的语句
        if (
          path.node.kind === 'const' &&
          t.isCallExpression(path.node.declarations[0].init)
        ) {
          lastConstDeclaration = path;
        }
      }
    });

    if (lastConstDeclaration) {
      const newConstDeclaration = parser.parse(
        `\nconst ${componentName} = React.lazy(() => import('${importPath}'));`
      ).program.body[0];

      (lastConstDeclaration as any).insertAfter(newConstDeclaration);
    }

    await this.formattedWriteFileCodeWithAst(ast, filePath);
  }

  static async addMenuItemVariable(options: IAddMenuItemVariableOptions) {
    const { filePath, value, variableName } = options;

    const ast = await this.fileCodeToAst(filePath);
    let lastMenuItemDeclaration = null;

    traverse(ast, {
      VariableDeclaration(path) {
        //找到最后一个菜单函数
        if (
          path.node.kind === 'const' &&
          t.isArrowFunctionExpression(path.node.declarations[0].init)
        ) {
          lastMenuItemDeclaration = path;
        }
      }
    });

    if (lastMenuItemDeclaration) {
      const newConstDeclaration = this.valueToAst(value);

      const functionId = t.identifier(variableName);
      functionId.typeAnnotation = t.tsTypeAnnotation(
        t.tsTypeReference(t.identifier('GenerateMenuItemType'))
      );

      const arrowFunction = t.arrowFunctionExpression(
        [t.identifier('projectID')],
        newConstDeclaration
      );

      const declaration = t.variableDeclaration('const', [
        t.variableDeclarator(functionId, arrowFunction)
      ]);

      (lastMenuItemDeclaration as any).insertAfter(declaration);
    }

    await this.formattedWriteFileCodeWithAst(ast, filePath);
  }

  static async addStringLiteralToType(options: IAddStringLiteralOptions) {
    const { filePath, typeName, stringLiteral } = options;

    const ast = await this.fileCodeToAst(filePath);
    let existingTypeName = false;

    traverse(ast, {
      TSTypeAliasDeclaration(path) {
        if (
          path.node.id.name === typeName &&
          t.isTSUnionType(path.node.typeAnnotation)
        ) {
          existingTypeName = true;
          path.node.typeAnnotation.types.push(
            t.tsLiteralType(t.stringLiteral(stringLiteral))
          );
        }
      }
    });

    if (!existingTypeName) {
      throw new Error(`TSUnionType "${typeName}" not found in ${filePath}`);
    }

    await this.formattedWriteFileCodeWithAst(ast, filePath);
  }
}
