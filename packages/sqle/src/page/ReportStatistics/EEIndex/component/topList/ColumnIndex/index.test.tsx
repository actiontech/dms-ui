import { renderWithTheme } from '../../../../../../testUtils/customRender';

import ColumnIndex from '.';

describe('ReportStatistics/topList/ColumnIndex', () => {
  it('render snap ColumnIndex', () => {
    const { baseElement } = renderWithTheme(<ColumnIndex index={1} children={'children string'} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap ColumnIndex when children node', () => {
    const { baseElement } = renderWithTheme(
      <ColumnIndex index={1} children={<span>children node</span>} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
