import ResultIconRender, { IResultIconRender } from '../ResultIconRender';

import { renderWithTheme } from '../../../testUtils/customRender';

describe('sqle/components/AuditResultMessage/ResultIconRender', () => {
  const customRender = (params: IResultIconRender) => {
    return renderWithTheme(<ResultIconRender {...params} />);
  };

  it('render icon when has diff icon', () => {
    const { baseElement } = customRender({
      iconLevels: ['normal', 'notice', 'warn', 'error', '']
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render icon when has same icon', () => {
    const { baseElement } = customRender({
      iconLevels: [
        'normal',
        'notice',
        'warn',
        'normal',
        'normal',
        'normal',
        'error',
        ''
      ]
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render icon when no icon data', () => {
    const { baseElement } = customRender({
      iconLevels: []
    });
    expect(baseElement).toMatchSnapshot();
  });
});
