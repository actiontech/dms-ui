import ReportDrawer from '..';

import { renderWithTheme } from '../../../testUtils/customRender';
import { DetailReportDrawerProps } from '../index.type';
import { cleanup } from '@testing-library/react';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('sqle/components/ReportDrawer', () => {
  const customRender = (params: DetailReportDrawerProps) => {
    return renderWithTheme(<ReportDrawer {...params} />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
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
            level: 'error',
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
        sqlSourceFile:
          'file_source/file_1/file_2/file_3/file_4/file_5/source.sql',
        sqlStartLine: 3,
        auditResult: [
          {
            rule_name: 'rule a',
            message: 'message',
            level: 'warn',
            annotation: 'annotation',
            db_type: 'mysql'
          }
        ]
      },
      onClose: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when loading is true', () => {
    const { baseElement } = customRender({
      open: true,
      title: 'this is a title',
      showAnnotation: true,
      showSourceFile: true,
      data: {
        sql: 'select 1',
        sqlSourceFile:
          'file_source/file_1/file_2/file_3/file_4/file_5/source.sql',
        sqlStartLine: 3,
        auditResult: [
          {
            rule_name: 'rule a',
            message: 'message',
            level: 'normal',
            annotation: 'annotation',
            db_type: 'mysql'
          }
        ]
      },
      onClose: jest.fn(),
      loading: true
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
            level: 'warn',
            annotation: 'annotation',
            db_type: 'mysql',
            isRuleDeleted: true
          },
          {
            rule_name: 'rule b',
            message: 'message2',
            level: 'error',
            annotation: 'annotation',
            db_type: 'mysql'
          }
        ]
      },
      onClose: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has extra', () => {
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
            level: 'error',
            annotation: 'annotation',
            db_type: 'mysql'
          }
        ]
      },
      onClose: jest.fn(),
      extra: <div>extra</div>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it.only('render snap when audit rule is exception', () => {
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
            level: 'audit_execution_error',
            annotation: 'annotation',
            db_type: 'mysql'
          }
        ]
      },
      onClose: jest.fn(),
      extra: <div>extra</div>
    });
    expect(baseElement).toMatchSnapshot();
  });
});
