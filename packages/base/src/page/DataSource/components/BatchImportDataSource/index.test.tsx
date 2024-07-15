import project from '../../../../testUtils/mockApi/project';
import { mockBatchImportDBCheckData } from '../../../../testUtils/mockApi/project/data';
import { superRender } from '../../../../testUtils/customRender';
import ProjectImport from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import 'blob-polyfill';
import DBService from '@actiontech/shared/lib/api/base/service/DBService';
import { AxiosResponse } from 'axios';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('base/DataSource/BatchImportDataSource', () => {
  let importDBServicesOfOneProjectSpy: jest.SpyInstance;
  let getImportDBServicesTemplateSpy: jest.SpyInstance;
  let importDBServicesOfOneProjectCheckSpy: jest.SpyInstance;
  let dbServicesConnectionSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    importDBServicesOfOneProjectSpy = project.importDBServicesOfOneProject();
    getImportDBServicesTemplateSpy = project.getImportDBServicesTemplate();
    importDBServicesOfOneProjectCheckSpy =
      project.importDBServicesOfOneProjectCheck();
    dbServicesConnectionSpy = project.dbServicesConnection();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('批量导入数据源')).toBeInTheDocument();
    expect(screen.getByText('批量测试数据源连通性')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回数据源列表'));
  });

  it('render download data source template', async () => {
    superRender(<ProjectImport />);
    await act(async () => {
      fireEvent.click(screen.getByText('下载导入模板'));
      await jest.advanceTimersByTime(100);
    });
    expect(screen.getByText('下载导入模板').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getImportDBServicesTemplateSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('下载导入模板').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
  });

  it('render delete file', async () => {
    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#files', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(100));
    expect(importDBServicesOfOneProjectCheckSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseMove(getBySelector('.ant-upload-list-item'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-upload-list-item-action'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryByText('test.csv')).not.toBeInTheDocument();
  });

  it('render check api return csv file', async () => {
    importDBServicesOfOneProjectCheckSpy.mockClear();
    const spy = jest.spyOn(DBService, 'ImportDBServicesOfOneProjectCheck');
    spy.mockImplementation(() => {
      return new Promise<AxiosResponse<any>>((res) => {
        setTimeout(() => {
          res({
            status: 200,
            headers: {
              'content-disposition':
                'attachment; filename=import_db_services_problems.csv'
            },
            config: {},
            statusText: '',
            data: new Blob(['text'])
          });
        }, 3000);
      });
    });

    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#files', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(importDBServicesOfOneProjectCheckSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(
        '当前导入信息存在校验失败，请结合下载文件中的提示进行修改，并重新导入'
      )
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render test connection', async () => {
    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText('批量测试数据源连通性').closest('button')
    ).toBeDisabled();
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#files', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('批量测试数据源连通性').closest('button')
    ).not.toBeDisabled();
    fireEvent.click(screen.getByText('批量测试数据源连通性'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(dbServicesConnectionSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('测试连通性成功1个')).toBeInTheDocument();
    expect(
      screen.getByText('测试连通性失败1个，数据源为mysql_1')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render upload file', async () => {
    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('导 入').closest('button')).toBeDisabled();
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#files', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('导 入').closest('button')).not.toBeDisabled();
    fireEvent.click(screen.getByText('导 入'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('导 入').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(importDBServicesOfOneProjectSpy).toHaveBeenCalledTimes(1);
    expect(importDBServicesOfOneProjectSpy).toHaveBeenNthCalledWith(1, {
      db_services: mockBatchImportDBCheckData,
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('批量导入数据源成功')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('关闭并重置表单'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('请选择导入文件')).toBeInTheDocument();
  });

  it('render upload file error', async () => {
    importDBServicesOfOneProjectSpy.mockClear();
    importDBServicesOfOneProjectSpy.mockImplementation(() =>
      createSpyFailResponse({})
    );
    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('导 入').closest('button')).toBeDisabled();
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#files', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('导 入').closest('button')).not.toBeDisabled();
    fireEvent.click(screen.getByText('导 入'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('导 入').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(importDBServicesOfOneProjectSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('导 入').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.queryByText('批量导入数据源成功')).not.toBeInTheDocument();
  });
});
