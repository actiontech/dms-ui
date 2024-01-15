import { renderWithThemeAndRedux } from '../../../../../../testUtils/customRender';
import { mockThemeStyleData } from '../../../../../../testUtils/mockHooks/mockThemeStyleData';

import CardShow, { ICardShowProps } from '.';

describe('ReportStatistics/CardShow', () => {
  const customRender = (params: ICardShowProps) => {
    return renderWithThemeAndRedux(<CardShow {...params} />);
  };

  beforeEach(() => {
    mockThemeStyleData();
  });

  it('render snap when has default val', () => {
    const { baseElement } = customRender({
      titleCont: 'title',
      numberCont: '1',
      noteCont: 'note content'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has default val', () => {
    const { baseElement } = customRender({
      titleCont: 'title',
      numberCont: '',
      noteCont: 'note content'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has extraIcon val', () => {
    const { baseElement } = customRender({
      titleCont: <span>title</span>,
      numberCont: <span>11</span>,
      noteCont: <span>note content</span>,
      extraIcon: <span>extraIcon</span>
    });
    expect(baseElement).toMatchSnapshot();
  });
});
