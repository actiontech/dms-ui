import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { markdownPreviewOptions } from '../markdownPreviewOptions';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import React from 'react';

jest.mock('rehype-rewrite', () => {
  return {
    getCodeString: jest.fn()
  };
});

type CodeMethodProps = {
  className: string;
  children: React.ReactNode;
  node?: { children: React.ReactNode };
};

describe('markdownPreviewOptions', () => {
  const codeMethod = markdownPreviewOptions?.components
    ?.code as React.ComponentType<CodeMethodProps>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const customRender = (props: CodeMethodProps) => {
    return superRender(React.createElement(codeMethod, props));
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  it('should handle label code blocks correctly', () => {
    const props = {
      className: 'language-label',
      children: ['label [test1, test2]'],
      node: { children: [] }
    };

    const { container } = customRender(props);

    expect(container).toMatchSnapshot();
  });

  it('should handle sql_diff code blocks correctly', () => {
    const code = `---before
      SELECT * FROM Users
      WHERE id > 0 
      AND status = 'active'
    ---after
      SELECT id, name 
      FROM Users
      WHERE id > 0 
      AND status = 'active'`;

    const props = {
      className: 'language-sql_diff',
      children: code
    };

    const { container } = customRender(props);

    expect(container).toMatchSnapshot();
  });

  it('should handle sql code blocks correctly', () => {
    const code = `SELECT * FROM Users
    WHERE id > 0 
    AND status = 'active'`;

    const props = {
      className: 'language-sql',
      children: code
    };

    const { container } = customRender(props);

    expect(container).toMatchSnapshot();
  });

  it('should handle null or undefined children', () => {
    const props = {
      className: 'language-javascript',
      children: undefined,
      node: { children: [] }
    };

    const { container } = customRender(props);

    expect(container).toMatchSnapshot();

    const codeElement = container.querySelector('code');
    expect(codeElement).not.toBeNull();
    expect(codeElement?.textContent).toBe('');
    expect(container).toMatchSnapshot();
  });
});
