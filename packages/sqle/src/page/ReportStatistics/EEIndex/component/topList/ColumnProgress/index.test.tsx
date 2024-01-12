import ColumnProgress from '.';
import { renderWithTheme } from '../../../../../../testUtils/customRender';

describe('ReportStatistics/topList/ColumnProgress', () => {
  it('render snap when barWidth is 0', () => {
    const { baseElement } = renderWithTheme(<ColumnProgress barWidth={0} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when barWidth val less than 0', () => {
    const { baseElement } = renderWithTheme(<ColumnProgress barWidth={-6} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when barWidth val more than 100', () => {
    const { baseElement } = renderWithTheme(
      <ColumnProgress barWidth={120.9} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when barWidth val is float', () => {
    const { baseElement } = renderWithTheme(
      <ColumnProgress barWidth={60.9432} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
