import ResultIconRender from '../ResultIconRender';
import { renderWithTheme } from '../../../testUtils/customRender';
import { ResultIconRenderProps } from '../index.type';
import { screen } from '@testing-library/dom';

describe('sqle/components/AuditResultMessage/ResultIconRender', () => {
  const customRender = (params: ResultIconRenderProps) => {
    return renderWithTheme(<ResultIconRender {...params} />);
  };

  it('render icon when has diff icon', () => {
    const { baseElement } = customRender({
      auditResultInfo: ['normal', 'notice', 'warn', 'error', ''].map(
        (item) => ({ level: item, executionFailed: false })
      )
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render icon when has same icon', () => {
    const { baseElement } = customRender({
      auditResultInfo: [
        'normal',
        'notice',
        'warn',
        'normal',
        'normal',
        'normal',
        'error',
        ''
      ].map((item) => ({ level: item, executionFailed: false }))
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render normal icon when no icon data', () => {
    const { baseElement } = customRender({
      auditResultInfo: []
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render normal icon when iconLevels is undefined', () => {
    const { baseElement } = customRender({});
    expect(baseElement).toMatchSnapshot();
  });

  it('render auditing tag when isAuditing is truthy', async () => {
    const { baseElement } = customRender({ isAuditing: true });
    expect(baseElement).toMatchSnapshot();
  });

  it('should render exception info when levels include "audit_execution_error"', () => {
    const { baseElement } = customRender({
      auditResultInfo: [
        { level: 'normal', executionFailed: false },
        { level: 'warn', executionFailed: false },
        { level: 'warn', executionFailed: true },
        { level: 'normal', executionFailed: false }
      ]
    });

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审核存在异常')).toBeInTheDocument();
  });
});
