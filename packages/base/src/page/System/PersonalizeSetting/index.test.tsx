import PersonalizeSetting from '.';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { mockSystemConfig } from '../../../testUtils/mockHooks/mockSystemConfig';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { SystemRole } from '@actiontech/shared/lib/enum';

describe('base/System/PersonalizeSetting', () => {
  let requestGetBasicInfo: jest.SpyInstance;
  let requestPersonalization: jest.SpyInstance;
  const customRender = () => {
    return superRender(<PersonalizeSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
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
    expect(requestGetBasicInfo).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when user is not admin', async () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false,
        [SystemRole.globalViewing]: false,
        [SystemRole.createProject]: false,
        [SystemRole.certainProjectManager]: false
      }
    });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllBySelector('.ant-upload-disabled')[0]).toBeInTheDocument();
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
    expect(requestPersonalization).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestPersonalization).toHaveBeenCalledWith(
      { title: 'SQLE-test-title' },
      { headers: { 'content-type': 'multipart/form-data' } }
    );
    await act(async () => jest.advanceTimersByTime(3100));
    expect(requestGetBasicInfo).toHaveBeenCalled();
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
    expect(requestPersonalization).toHaveBeenCalled();
  });
});
