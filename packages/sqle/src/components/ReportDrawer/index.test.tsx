import ReportDrawer from '.';

import { renderWithTheme } from '../../testUtils/customRender';
import { DetailReportDrawerProps } from './index.type';
import { cleanup } from '@testing-library/react';

describe('sqle/components/ReportDrawer', () => {
  const customRender = (params: DetailReportDrawerProps) => {
    return renderWithTheme(<ReportDrawer {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap open is false', () => {
    const { baseElement } = customRender({
      open: false,
      title: 'this is a title',
      data: null,
      onClose: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap is empty', () => {
    const { baseElement } = customRender({
      open: true,
      title: 'this is a title',
      data: null,
      onClose: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has data', () => {
    const { baseElement } = customRender({
      open: true,
      title: 'this is a title',
      showAnnotation: true,
      data: {
        sql: 'select 1',
        sqlSourceFile: 'file_source',
        sqlStartLine: 3,
        auditResult: [
          {
            rule_name: 'rule a',
            message: 'message',
            level: 'level',
            annotation: 'annotation',
            db_type: 'mysql'
          }
        ]
      },
      onClose: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when showSourceFile is true', () => {
    const { baseElement } = customRender({
      open: true,
      title: 'this is a title',
      showAnnotation: true,
      showSourceFile: true,
      data: {
        sql: 'select 1',
        sqlSourceFile: 'file_source',
        sqlStartLine: 3,
        auditResult: [
          {
            rule_name: 'rule a',
            message: 'message',
            level: 'level',
            annotation: 'annotation',
            db_type: 'mysql'
          }
        ]
      },
      onClose: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has delete rule', () => {
    const { baseElement } = customRender({
      open: true,
      title: 'this is a title',
      showAnnotation: true,
      showSourceFile: true,
      data: {
        sql: 'select 1',
        sqlSourceFile: 'file_source',
        sqlStartLine: 3,
        auditResult: [
          {
            rule_name: 'rule a',
            message: 'message1',
            level: 'level',
            annotation: 'annotation',
            db_type: 'mysql',
            isRuleDeleted: true
          },
          {
            rule_name: 'rule b',
            message: 'message2',
            level: 'level',
            annotation: 'annotation',
            db_type: 'mysql'
          }
        ]
      },
      onClose: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });
});
