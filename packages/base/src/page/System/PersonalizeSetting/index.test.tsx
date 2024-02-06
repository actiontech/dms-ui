import PersonalizeSetting from '.';
import dms from '../../../testUtils/mockApi/global';
import system from '../../../testUtils/mockApi/system';
import { mockSystemConfig } from '../../../testUtils/mockHooks/mockSystemConfig';

import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('base/System/PersonalizeSetting', () => {
  let requestGetBasicInfo: jest.SpyInstance;
  let requestPersonalization: jest.SpyInstance;
  const customRender = () => {
    return superRender(<PersonalizeSetting />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1612148800);
    mockSystemConfig();
    requestGetBasicInfo = dms.getBasicInfo();
    requestPersonalization = system.updatePersonalizationConfig();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestGetBasicInfo).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render title edit', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3100));

    expect(screen.getByText('Actiontech')).toBeInTheDocument();
    fireEvent.mouseOver(screen.getByText('Actiontech'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    const editIconBtn = getBySelector(
      '.config-item-filed-edit-button',
      baseElement
    );
    fireEvent.mouseOver(editIconBtn);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(editIconBtn);
    await act(async () => jest.advanceTimersByTime(500));

    const editInputEle = getBySelector('#editInput', baseElement);
    fireEvent.change(editInputEle, {
      target: {
        value: 'SQLE-test-title'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.keyDown(editInputEle, {
      key: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    expect(requestPersonalization).toBeCalled();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestPersonalization).toBeCalledWith(
      { title: 'SQLE-test-title' },
      { headers: { 'content-type': 'multipart/form-data' } }
    );
    await act(async () => jest.advanceTimersByTime(3100));
    expect(requestGetBasicInfo).toBeCalled();
  });

  it('render upgrade logo img', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3100));

    const uploadEle = getBySelector('.ant-upload-wrapper', baseElement);
    fireEvent.mouseOver(uploadEle);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    const imgFile = new File([new Blob([''], { type: 'image/png' })], 'a.png');
    fireEvent.change(
      getBySelector('.ant-upload input[type=file]', baseElement),
      {
        target: { files: [imgFile] }
      }
    );
    await act(async () => jest.advanceTimersByTime(2000));
    expect(requestPersonalization).toBeCalled();
  });
});
