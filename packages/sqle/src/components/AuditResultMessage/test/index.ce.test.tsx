/**
 * @test_version ce
 */

import AuditResultMessage from '..';
import { AuditResultMessageProps } from '../index.type';

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
