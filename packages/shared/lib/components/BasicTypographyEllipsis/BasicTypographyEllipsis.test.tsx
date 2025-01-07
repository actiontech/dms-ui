import { renderWithTheme } from '../../testUtil/customRender';
import BasicTypographyEllipsis from './BasicTypographyEllipsis';
import { BasicTypographyEllipsisProps } from './BasicTypographyEllipsis.types';

describe('lib/BasicTypographyEllipsis', () => {
  const customRender = (params: BasicTypographyEllipsisProps) => {
    return renderWithTheme(
      <div className="ellipsis-column-width">
        <BasicTypographyEllipsis {...params} />
      </div>
    );
  };

  it('render less than tooltipLimitLength', () => {
    const { baseElement } = customRender({
      textCont:
        '这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。',
      linkData: {
        route: '/',
        text: '查看更多'
      },
      tooltipsMaxWidth: 200
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render more than tooltipLimitLength', () => {
    const { baseElement } = customRender({
      tooltipLimitLength: 100,
      textCont:
        '这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render link for tool tip', () => {
    const { baseElement } = customRender({
      tooltipLimitLength: 10,
      textCont: '这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。',
      linkData: {
        route: '/',
        text: '查看更多'
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render custom tooltips', () => {
    expect(
      customRender({
        textCont:
          '这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。',
        tooltips: false
      }).container
    ).toMatchSnapshot();

    expect(
      customRender({
        textCont:
          '这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。',
        tooltips: true
      }).container
    ).toMatchSnapshot();

    expect(
      customRender({
        textCont:
          '这是一个非常长的tool tip信息。这是一个非常长的tool tip信息。',
        tooltips: {
          placement: 'bottom'
        }
      }).container
    ).toMatchSnapshot();
  });
});
