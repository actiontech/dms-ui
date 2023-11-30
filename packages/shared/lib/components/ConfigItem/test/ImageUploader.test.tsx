import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../../testUtil/customRender';
import { IConfigItemImageUploaderProps } from '../index.type';
import ImageUploader from '../components/ImageUploader';
import { getBySelector } from '../../../testUtil/customQuery';

describe('lib/ConfigItem-ImageUploader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Date.now = () => 1612148800;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: IConfigItemImageUploaderProps) => {
    return renderWithTheme(<ImageUploader {...params} />);
  };

  it('render loading is true', () => {
    const { baseElement } = customRender({
      submitLoading: true,
      url: 'http://mock.com',
      onSubmit: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render loading is false', () => {
    const { baseElement } = customRender({
      submitLoading: false,
      url: 'http://mock.com',
      onSubmit: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render mask ui', async () => {
    const { baseElement } = customRender({
      submitLoading: false,
      url: 'http://mock.com',
      onSubmit: jest.fn()
    });
    const uploadWrapperEle = getBySelector(
      '.upload-content-wrapper',
      baseElement
    );
    await act(async () => {
      fireEvent.mouseEnter(uploadWrapperEle);
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.mouseLeave(uploadWrapperEle);
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });
});
