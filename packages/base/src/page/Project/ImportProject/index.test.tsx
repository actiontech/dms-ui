import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import { mockPreviewImportProjects } from '@actiontech/shared/lib/testUtil/mockApi/base/project/data';
import { baseSuperRender } from '../../../testUtils/superRender';
import ProjectImport from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import {
  createSpySuccessResponse,
  createSpyErrorResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { IPreviewImportProjects } from '@actiontech/shared/lib/api/base/service/common';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('base/Project/Import', () => {
  const navigateSpy = jest.fn();
  let importProjectsSpy: jest.SpyInstance;
  let getImportProjectsTemplateSpy: jest.SpyInstance;
  let previewImportProjectsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    importProjectsSpy = project.importProjects();
    getImportProjectsTemplateSpy = project.getImportProjectsTemplate();
    previewImportProjectsSpy = project.previewImportProjects();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('render return to list page', async () => {
    const { baseElement } = baseSuperRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('导入项目及业务')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回项目列表'));
  });

  test('render download project template', async () => {
    baseSuperRender(<ProjectImport />);
    await act(async () => {
      fireEvent.click(screen.getByText('下载导入模板'));
      await jest.advanceTimersByTime(100);
    });
    expect(screen.getByText('下载导入模板').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getImportProjectsTemplateSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('下载导入模板').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
  });

  test('render delete file', async () => {
    const { baseElement } = baseSuperRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#projectFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseMove(getBySelector('.ant-upload-list-item'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-upload-list-item-action'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryByText('test.csv')).not.toBeInTheDocument();
  });

  test('render preview file', async () => {
    previewImportProjectsSpy.mockClear();
    const mockData: IPreviewImportProjects[] = [];
    for (let index = 0; index < 12; index++) {
      mockData.push({
        name: `test${index}`,
        business: []
      });
    }
    previewImportProjectsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockData
      })
    );
    const { baseElement } = baseSuperRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#projectFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(previewImportProjectsSpy).toHaveBeenCalledTimes(1);
    expect(previewImportProjectsSpy).toHaveBeenCalledWith({
      projects_file: file
    });
    expect(getAllBySelector('.ant-table-row')).toHaveLength(10);
  });

  test('render preview file when request error', async () => {
    previewImportProjectsSpy.mockClear();
    previewImportProjectsSpy.mockImplementation(() =>
      createSpyErrorResponse({})
    );
    const { baseElement } = baseSuperRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#projectFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(previewImportProjectsSpy).toHaveBeenCalledTimes(1);
    expect(previewImportProjectsSpy).toHaveBeenCalledWith({
      projects_file: file
    });
    expect(screen.queryByText('.ant-table')).not.toBeInTheDocument();
  });

  test('render upload file', async () => {
    const { baseElement } = baseSuperRender(<ProjectImport />);
    await act(async () => jest.advanceTimersByTime(300));
    const file = new File([''], 'test.csv');
    fireEvent.change(getBySelector('#projectFile', baseElement), {
      target: { files: [file] }
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(previewImportProjectsSpy).toHaveBeenCalledTimes(1);
    expect(previewImportProjectsSpy).toHaveBeenCalledWith({
      projects_file: file
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.click(screen.getByText('导 入'));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(importProjectsSpy).toHaveBeenCalledTimes(1);
    expect(importProjectsSpy).toHaveBeenCalledWith({
      projects: mockPreviewImportProjects
    });
    expect(screen.getByText('导入项目及业务成功')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('关闭并重置表单'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('请选择导入文件')).toBeInTheDocument();
  });
});
