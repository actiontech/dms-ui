import { fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../../../testUtils/customRender';
import ExportMethodItems from '../ExportMethodItems';
import { ExportMethodEnum } from '../index.enum';

describe('test ExportMethodItems', () => {
  it('should match snapshot', () => {
    const changeSpy = jest.fn();
    const { container } = superRender(
      <ExportMethodItems value={ExportMethodEnum.sql} onChange={changeSpy} />
    );

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('输入SQL语句'));
    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledWith(ExportMethodEnum.sql);
  });
});
