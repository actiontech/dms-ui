import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtils/customRender';

import UploadType from '../UploadType';
import { SQLInputType } from '..';

describe('sqle/Order/UploadType', () => {
  const onChangeFn = jest.fn();
  const customRender = (value: SQLInputType = SQLInputType.manualInput) => {
    return renderWithTheme(<UploadType value={value} onChange={onChangeFn} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render upload item snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render upload item is uploadFile', () => {
    const { baseElement } = customRender(SQLInputType.uploadFile);
    expect(baseElement).toMatchSnapshot();
  });

  it('render upload item is zipFile', () => {
    const { baseElement } = customRender(SQLInputType.zipFile);
    expect(baseElement).toMatchSnapshot();
  });

  it('render upload item change', async () => {
    const { baseElement } = customRender();
    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(onChangeFn).toBeCalled();
  });
});
