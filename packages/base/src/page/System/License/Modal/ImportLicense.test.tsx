import ImportLicenseModal from './ImportLicense';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';

import system from '../../../../testUtils/mockApi/system';

import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/System/License/ImportLicenseModal', () => {
  let requestCheckLicense: jest.SpyInstance;
  let requestSetLicense: jest.SpyInstance;
  const modalStatusDispatch = jest.fn();
  const customRender = () => {
    return renderWithTheme(<ImportLicenseModal />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => modalStatusDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        system: {
          modalStatus: {
            [ModalName.DMS_Import_License]: true
          }
        }
      });
    });
    requestCheckLicense = system.CheckLicense();
    requestSetLicense = system.SetLicense();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap when closed modal', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(modalStatusDispatch).toHaveBeenCalled();
    expect(modalStatusDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.DMS_Import_License,
        status: false
      },
      type: 'system/updateModalStatus'
    });
  });

  it('render snap when change license file success', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('导入许可信息')).toBeInTheDocument();
    expect(screen.getByText('License文件')).toBeInTheDocument();
    expect(screen.getByText('选择文件上传')).toBeInTheDocument();
    expect(screen.getByText('提 交')).toBeInTheDocument();

    const mockFileTxt = new File([''], 'test.txt');
    fireEvent.change(
      getBySelector('.ant-upload input[type=file]', baseElement),
      {
        target: { files: [mockFileTxt] }
      }
    );
    await act(async () => jest.advanceTimersByTime(2000));
    expect(baseElement).toMatchSnapshot();
    expect(requestCheckLicense).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(1200));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSetLicense).toHaveBeenCalled();

    expect(modalStatusDispatch).toHaveBeenCalled();
    expect(modalStatusDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.DMS_Import_License,
        status: false
      },
      type: 'system/updateModalStatus'
    });

    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_License_List
    );
    expect(baseElement).toMatchSnapshot();
  });
});
