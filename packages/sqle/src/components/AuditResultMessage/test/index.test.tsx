import AuditResultMessage from '..';
import { AuditResultMessageProps } from '../index.type';
import { getAuditTaskSQLsV2FilterAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { screen } from '@testing-library/react';

import { renderWithTheme } from '../../../testUtils/customRender';

describe('sqle/components/AuditResultMessage', () => {
  const customRender = (params: AuditResultMessageProps) => {
    return renderWithTheme(<AuditResultMessage {...params} />);
  };

  it('render snap when auditResult is {}', () => {
    const { baseElement } = customRender({
      auditResult: {},
      styleClass: 'custom-class-name'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditResult is empty and audit is doing', () => {
    const { baseElement } = customRender({
      auditResult: {},
      auditStatus: getAuditTaskSQLsV2FilterAuditStatusEnum.doing
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render rule desc before audit message and rule key', () => {
    customRender({
      auditResult: {
        level: 'error',
        rule_name: 'ddl_check_table_without_if_not_exists',
        desc: '新建表建议加入 IF NOT EXISTS',
        message: '最末次命中：新建表建议加入 IF NOT EXISTS'
      }
    });

    expect(
      screen.getByText('新建表建议加入 IF NOT EXISTS')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('ddl_check_table_without_if_not_exists')
    ).toBeNull();
    expect(
      screen.queryByText('最末次命中：新建表建议加入 IF NOT EXISTS')
    ).toBeNull();
  });

  it('render message instead of rule key when desc is absent', () => {
    customRender({
      auditResult: {
        level: 'error',
        rule_name: 'ddl_check_table_without_if_not_exists',
        message: '最末次命中：新建表建议加入 IF NOT EXISTS'
      }
    });

    expect(
      screen.getByText('最末次命中：新建表建议加入 IF NOT EXISTS')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('ddl_check_table_without_if_not_exists')
    ).toBeNull();
  });

  describe('render snap when has diff level', () => {
    it('render snap when level is empty', () => {
      const { baseElement } = customRender({
        auditResult: { level: '' }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when level is normal', () => {
      const { baseElement } = customRender({
        auditResult: { level: 'normal' }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when level is UNKNOWN', () => {
      const { baseElement } = customRender({
        auditResult: { level: 'UNKNOWN' }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when level is UNKNOWN', () => {
      const { baseElement } = customRender({
        auditResult: { level: 'UNKNOWN' }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when level is notice', () => {
      const { baseElement } = customRender({
        auditResult: { level: 'notice' }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when level is warn', () => {
      const { baseElement } = customRender({
        auditResult: { level: 'warn' }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when level is error', () => {
      const { baseElement } = customRender({
        auditResult: { level: 'error' }
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

  it('render snap when showAnnotation', () => {
    const { baseElement } = customRender({
      showAnnotation: true,
      auditResult: {
        annotation: 'annotation text'
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has more link', () => {
    const { baseElement } = customRender({
      showAnnotation: true,
      auditResult: {
        annotation: 'annotation text',
        level: ''
      },
      moreBtnLink: 'this is a link'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when current result is delete from rule manage & showAnnotation is true', () => {
    const { baseElement } = customRender({
      showAnnotation: true,
      isRuleDeleted: true,
      auditResult: {
        annotation: 'annotation text',
        level: ''
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when current result is delete from rule manage & showAnnotation is false', () => {
    const { baseElement } = customRender({
      showAnnotation: false,
      isRuleDeleted: true,
      auditResult: {
        annotation: 'annotation text',
        level: ''
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
