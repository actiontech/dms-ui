import { useDispatch } from 'react-redux';
import License from '.';
import { ModalName } from '../../../data/ModalName';

import system from '../../../testUtils/mockApi/system';

import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

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
    expect(requestGetLicense).toHaveBeenCalled();
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

  it('render snap when click collect btn', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('收集许可信息')).toBeInTheDocument();
    fireEvent.click(screen.getByText('收集许可信息'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestGetLicenseInfo).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
