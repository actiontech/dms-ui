import { fireEvent, act, cleanup } from '@testing-library/react';
import { superRender } from '../../../testUtil/customRender';
import { ConfigItemImageUploaderProps } from '../ConfigItem.types';
import ImageUploader from '../components/ImageUploader';
import { getBySelector } from '../../../testUtil/customQuery';

describe('lib/ConfigItem-ImageUploader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1612148800);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: ConfigItemImageUploaderProps) => {
    return superRender(<ImageUploader {...params} />);
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
    expect(
      baseElement.querySelector('.upload-content-wrapper')
    ).toBeInTheDocument();
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
  });
});
