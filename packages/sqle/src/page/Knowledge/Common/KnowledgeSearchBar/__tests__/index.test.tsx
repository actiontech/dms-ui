import { act, cleanup, screen, fireEvent } from '@testing-library/react';
import KnowledgeSearchBar from '../index';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import knowledgeBase from '../../../../../testUtils/mockApi/knowledgeBase';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('KnowledgeSearchBar', () => {
  let getKnowledgeBaseTagList: jest.SpyInstance;

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE]);

  beforeEach(() => {
    jest.useFakeTimers();
    getKnowledgeBaseTagList = knowledgeBase.getKnowledgeBaseTagList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', () => {
    const { container } = sqleSuperRender(<KnowledgeSearchBar />);
    expect(container).toMatchSnapshot();
    expect(getKnowledgeBaseTagList).not.toHaveBeenCalled();
  });

  it('render with allowSelectTag', async () => {
    const { container } = sqleSuperRender(
      <KnowledgeSearchBar allowSelectTag />
    );
    expect(getKnowledgeBaseTagList).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('已选择标签(0)')).toBeInTheDocument();
    fireEvent.click(screen.getByText('已选择标签(0)'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(container).toMatchSnapshot();
  });

  it('search empty searchText when allowSearchEmptyText is false', async () => {
    sqleSuperRender(<KnowledgeSearchBar />);
    const inputEle = getBySelector('textarea.ant-input');
    fireEvent.change(inputEle, {
      target: {
        value: ' '
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.search-icon'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('请输入关键字')).toBeInTheDocument();
  });

  it('search empty searchText when allowSearchEmptyText is true', async () => {
    const onSearchSpy = jest.fn();
    sqleSuperRender(
      <KnowledgeSearchBar allowSearchEmptyText onSearch={onSearchSpy} />
    );
    fireEvent.click(getBySelector('.search-icon'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onSearchSpy).toHaveBeenCalledTimes(1);
    expect(onSearchSpy).toHaveBeenCalledWith({
      searchText: '',
      selectedTags: []
    });
  });

  it('render controlled mode', async () => {
    const setSearchTextSpy = jest.fn();
    const onSearchSpy = jest.fn();
    sqleSuperRender(
      <KnowledgeSearchBar
        allowSelectTag
        searchText="test"
        selectedTags={['tag1']}
        setSearchText={setSearchTextSpy}
        setSelectedTags={jest.fn()}
        onSearch={onSearchSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.search-icon'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onSearchSpy).toHaveBeenCalledTimes(1);
    expect(onSearchSpy).toHaveBeenCalledWith({
      searchText: 'test',
      selectedTags: ['tag1']
    });
  });

  it('render uncontrolled mode', async () => {
    const onSearchSpy = jest.fn();
    sqleSuperRender(
      <KnowledgeSearchBar allowSelectTag onSearch={onSearchSpy} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    const inputEle = getBySelector('textarea.ant-input');
    fireEvent.change(inputEle, {
      target: {
        value: 'SELECT'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('已选择标签(0)'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('RAND'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getBySelector('.search-icon'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onSearchSpy).toHaveBeenCalledTimes(1);
    expect(onSearchSpy).toHaveBeenCalledWith({
      searchText: 'SELECT',
      selectedTags: ['RAND']
    });
  });
});
