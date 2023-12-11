import {
  checkButtonDisabled,
  checkButtonPermissions,
  extractTextFromReactNode,
  getColumnsLabel,
  setClassNameForColumns
} from '.';
import { ActiontechTableColumn } from '../index.type';

type typeData = { status: string };

describe('lib/ActiontechTable-utils', () => {
  describe('extractTextFromReactNode', () => {
    const customRender = (params: React.ReactNode) => {
      return extractTextFromReactNode(params);
    };

    it('render node is string', () => {
      const result = customRender('is string');
      expect(result).toBe('is string');
    });

    it('render node is react element', () => {
      const result = customRender(<div>this is a div</div>);
      expect(result).toBe('this is a div');

      const result1 = customRender(<div />);
      expect(result1).toBe('');

      const result2 = customRender(['1']);
      expect(result2).toBe('');
    });

    it('render node has children', () => {
      const result = customRender(
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>
            <span>4</span>
          </li>
        </ul>
      );
      expect(result).toBe('1234');
    });
  });

  describe('getColumnsLabel', () => {
    it('render labelInColumns is string', () => {
      const result = getColumnsLabel('is string');
      expect(result).toBe('is string');
    });

    it('render labelInColumns is object', () => {
      const result = getColumnsLabel(<div>1</div>);
      expect(result).toBe('1');
    });

    it('render labelInColumns is function', () => {
      const result = getColumnsLabel(() => 'function result');
      expect(result).toBe('function result');
    });

    it('render labelInColumns is other type', () => {
      const result = getColumnsLabel(3);
      expect(result).toBe('');

      const result1 = getColumnsLabel(true);
      expect(result1).toBe('');

      const result2 = getColumnsLabel(null);
      expect(result2).toBe('');
    });
  });

  describe('checkButtonPermissions', () => {
    it('render permission for custom function', () => {
      const permissions = (data?: typeData): boolean => {
        return data?.status === 'ok';
      };
      const result = checkButtonPermissions<typeData>(permissions, {
        status: 'ok'
      });
      expect(result).toBe(true);
    });

    it('render permission for boolean', () => {
      const result = checkButtonPermissions(true, {
        status: 'ok'
      });
      expect(result).toBeTruthy();

      const result1 = checkButtonPermissions(false, {
        status: 'ok'
      });
      expect(result1).toBeFalsy();
    });

    it('render no permission', () => {
      const result = checkButtonPermissions(undefined, {
        status: 'ok'
      });
      expect(result).toBeTruthy();
    });
  });

  describe('checkButtonDisabled', () => {
    it('render disabled is function', () => {
      const disabledFuc = (data?: typeData): boolean => {
        return data?.status === 'ok';
      };
      const result = checkButtonDisabled(disabledFuc, { status: 'unknown' });
      expect(result).toBeFalsy();
    });

    it('render disabled for boolean', () => {
      const result = checkButtonDisabled(true, {
        status: 'ok'
      });
      expect(result).toBeTruthy();

      const result1 = checkButtonDisabled(false, {
        status: 'ok'
      });
      expect(result1).toBeFalsy();
    });

    it('render no disabled', () => {
      const result = checkButtonDisabled(undefined, {
        status: 'ok'
      });
      expect(result).toBeFalsy();
    });
  });
  describe('setClassNameForColumns', () => {
    it('check setClassNameForColumns function', () => {
      const columns: ActiontechTableColumn = [
        {
          dataIndex: 'name',
          title: 'name'
        },
        {
          dataIndex: 'age',
          title: 'age'
        },
        {
          dataIndex: 'hobby',
          title: 'hobby'
        }
      ];
      const newColumns = setClassNameForColumns(columns);
      expect(newColumns).toEqual([
        {
          dataIndex: 'name',
          title: 'name',
          className: 'first-col'
        },
        {
          dataIndex: 'age',
          title: 'age'
        },
        {
          dataIndex: 'hobby',
          title: 'hobby',
          className: 'last-col'
        }
      ]);
      columns[0].className = 'name-class';
      columns[2].className = 'hobby-class';
      const newColumns1 = setClassNameForColumns(columns);
      expect(newColumns1).toEqual([
        {
          dataIndex: 'name',
          title: 'name',
          className: 'name-class first-col'
        },
        {
          dataIndex: 'age',
          title: 'age'
        },
        {
          dataIndex: 'hobby',
          title: 'hobby',
          className: 'hobby-class last-col'
        }
      ]);
    });
  });
});
