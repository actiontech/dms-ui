import project from '../../../testUtils/mockApi/project';
import { mockBatchImportDBCheckData } from '../../../testUtils/mockApi/project/data';
import { superRender } from '../../../testUtils/customRender';
import ProjectImport from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { AxiosResponse } from 'axios';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import 'blob-polyfill';

describe('base/Project/BatchImportDataSource', () => {
  let importDBServicesOfProjectsSpy: jest.SpyInstance;
  let getImportDBServicesTemplateSpy: jest.SpyInstance;
  let importDBServicesOfProjectsCheckSpy: jest.SpyInstance;
  let dbServicesConnectionSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    importDBServicesOfProjectsSpy = project.importDBServicesOfProjects();
    getImportDBServicesTemplateSpy = project.getImportDBServicesTemplate();
    importDBServicesOfProjectsCheckSpy =
      project.importDBServicesOfProjectsCheck();
    dbServicesConnectionSpy = project.dbServicesConnection();
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
    fireEvent.click(screen.getByText('返回项目列表'));
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
    fireEvent.change(getBySelector('#dbService', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(100));
    expect(importDBServicesOfProjectsCheckSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseMove(getBySelector('.ant-upload-list-item'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-upload-list-item-action'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryByText('test.csv')).not.toBeInTheDocument();
  });

  it('render check api return svg file', async () => {
    importDBServicesOfProjectsCheckSpy.mockClear();
    const spy = jest.spyOn(dms, 'ImportDBServicesOfProjectsCheck');
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
    const eventEmitterSpy = jest.spyOn(eventEmitter, 'emit');
    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#dbService', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(importDBServicesOfProjectsCheckSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EmitterKey.OPEN_GLOBAL_NOTIFICATION,
      'error',
      {
        description:
          '当前导入信息存在校验失败，请结合下载文件中的提示进行修改，并重新导入',
        message: '请求错误'
      }
    );
  });

  it('render test connection', async () => {
    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText('批量测试数据源连通性').closest('button')
    ).toBeDisabled();
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#dbService', baseElement), {
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
    fireEvent.change(getBySelector('#dbService', baseElement), {
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
    expect(importDBServicesOfProjectsSpy).toHaveBeenCalledTimes(1);
    expect(importDBServicesOfProjectsSpy).toHaveBeenNthCalledWith(1, {
      db_services: mockBatchImportDBCheckData
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('批量导入数据源成功')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('关闭并重置表单'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('请选择导入文件')).toBeInTheDocument();
  });

  it('render upload file error', async () => {
    importDBServicesOfProjectsSpy.mockClear();
    importDBServicesOfProjectsSpy.mockImplementation(() =>
      createSpyFailResponse({})
    );
    const { baseElement } = superRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('导 入').closest('button')).toBeDisabled();
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#dbService', baseElement), {
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
    expect(importDBServicesOfProjectsSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('导 入').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.queryByText('批量导入数据源成功')).not.toBeInTheDocument();
  });
});
