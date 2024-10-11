import { useDispatch } from 'react-redux';
import License from '.';
import { ModalName } from '../../../data/ModalName';
import system from '../../../testUtils/mockApi/system';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { AxiosResponse } from 'axios';
import 'blob-polyfill';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('base/System/License', () => {
  let requestGetLicenseInfo: jest.SpyInstance;
  let requestGetLicense: jest.SpyInstance;
  const modalStatusDispatch = jest.fn();

  const customRender = () => {
    return superRender(<License />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => modalStatusDispatch);
    system.mockAllApi();
    requestGetLicenseInfo = system.GetLicenseInfo();
    requestGetLicense = system.GetLicense();
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
    expect(baseElement).toMatchSnapshot();
    expect(requestGetLicense).toHaveBeenCalled();
  });

  it('render snap when limit data name is `info`', async () => {
    requestGetLicense.mockImplementation(() =>
      createSpySuccessResponse({
        license: [
          {
            name: 'info',
            limit: 'limit string cont',
            description: 'this is license desc info'
          },
          {
            name: 'test',
            limit: 'limit string cont 2',
            description: 'this is license desc info 2'
          }
        ]
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetLicense).toHaveBeenCalledTimes(1);
    expect(requestGetLicense).toHaveBeenCalledWith({
      headers: {
        'Accept-Language': 'zh-CN,en-US;'
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click import btn', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('导入许可信息')).toBeInTheDocument();
    fireEvent.click(screen.getByText('导入许可信息'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(modalStatusDispatch).toHaveBeenCalled();
    expect(modalStatusDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.DMS_Import_License,
        status: true
      },
      type: 'system/updateModalStatus'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('click collect btn when request return blob data', async () => {
    requestGetLicenseInfo.mockClear();
    requestGetLicenseInfo.mockImplementationOnce(() => {
      return new Promise<AxiosResponse<Blob>>((res) => {
        setTimeout(() => {
          res({
            status: 200,
            headers: {},
            config: {},
            statusText: '',
            data: new Blob(['testBlob'], {
              type: 'application/octet-stream'
            })
          });
        }, 3000);
      });
    });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('收集许可信息')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('收集许可信息'));
      await jest.advanceTimersByTime(3000);
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(requestGetLicenseInfo).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.ant-qrcode')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => {
      fireEvent.click(screen.getByText('导入许可信息'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('click collect btn when request return error message', async () => {
    requestGetLicenseInfo.mockClear();
    requestGetLicenseInfo.mockImplementationOnce(() => {
      return new Promise<AxiosResponse<Blob>>((res) => {
        setTimeout(() => {
          res({
            status: 200,
            headers: {},
            config: {},
            statusText: '',
            data: new Blob(
              [JSON.stringify({ code: 100, message: 'collect license error' })],
              {
                type: 'application/json'
              }
            )
          });
        }, 3000);
      });
    });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('收集许可信息')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('收集许可信息'));
      await jest.advanceTimersByTime(3000);
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(requestGetLicenseInfo).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
