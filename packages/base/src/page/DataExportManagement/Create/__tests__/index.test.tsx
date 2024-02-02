import { ignoreInvalidValueForCSSStyleProperty } from '@actiontech/shared/lib/testUtil/common';
import CreateDataExport from '..';
import { CreateDataExportPageEnum } from '../../../../store/dataExport';
import { superRender } from '../../../../testUtils/customRender';
import { mockUseCreateDataExportReduxManage } from '../testUtils/mockUseCreateDataExportReduxManage';
import { cleanup } from '@testing-library/react';

describe('first', () => {
  ignoreInvalidValueForCSSStyleProperty();

  it('should match snapshot when pageState is equal CREATE_TASK', () => {
    mockUseCreateDataExportReduxManage();

    const { container } = superRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when pageState is equal SUBMIT_WORKFLOW', () => {
    mockUseCreateDataExportReduxManage({
      pageState: CreateDataExportPageEnum.SUBMIT_WORKFLOW
    });

    const { container } = superRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when pageState is equal SUBMIT_RESULT', () => {
    mockUseCreateDataExportReduxManage({
      pageState: CreateDataExportPageEnum.SUBMIT_RESULT
    });

    const { container } = superRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();

    jest.clearAllMocks();
    cleanup();
    mockUseCreateDataExportReduxManage({
      pageState: null as any
    });

    expect(superRender(<CreateDataExport />).container).toMatchSnapshot();
  });

  it('component unmount', () => {
    const clearAllStateSpy = jest.fn();
    mockUseCreateDataExportReduxManage({
      clearAllState: clearAllStateSpy
    });
    const { unmount } = superRender(<CreateDataExport />);
    unmount();

    expect(clearAllStateSpy).toBeCalledTimes(1);
  });
});
