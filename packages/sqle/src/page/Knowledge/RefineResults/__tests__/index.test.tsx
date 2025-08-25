import { act, cleanup, screen, fireEvent } from '@testing-library/react';
import KnowledgeSearchResults from '../index';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import knowledgeBase from '@actiontech/shared/lib/testUtil/mockApi/sqle/knowledgeBase';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { useSearchParams } from 'react-router-dom';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { paramsSerializer } from '@actiontech/dms-kit';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useSearchParams: jest.fn()
  };
});

describe('KnowledgeSearchResults', () => {
  let getKnowledgeBaseListSpy: jest.SpyInstance;
  let getKnowledgeBaseTagListSpy: jest.SpyInstance;
  const useSearchParamsSpy: jest.Mock = useSearchParams as jest.Mock;
  const keywords = 'SELECT';
  const tags = 'tag';

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE]);

  beforeEach(() => {
    jest.useFakeTimers();
    getKnowledgeBaseListSpy = knowledgeBase.getKnowledgeBaseList();
    getKnowledgeBaseTagListSpy = knowledgeBase.getKnowledgeBaseTagList();
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        keywords,
        tags
      })
    ]);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = sqleSuperRender(<KnowledgeSearchResults />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getKnowledgeBaseListSpy).toHaveBeenCalledTimes(1);
    expect(getKnowledgeBaseListSpy).toHaveBeenCalledWith(
      {
        keywords,
        page_index: 1,
        page_size: 20,
        tags: [tags]
      },
      { paramsSerializer }
    );
    expect(getKnowledgeBaseTagListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(getAllBySelector('.highlight-text')[0]).toBeInTheDocument();
  });

  it('navigate to rule knowledge page', async () => {
    const windowOpenSpy = jest
      .spyOn(window, 'open')
      .mockImplementation(() => null);
    sqleSuperRender(<KnowledgeSearchResults />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getAllBySelector('.ant-list-item')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(windowOpenSpy).toHaveBeenCalledWith(
      '/sqle/rule/knowledge/SQLE00002/MySQL'
    );
  });

  it('render toggle paging', async () => {
    sqleSuperRender(<KnowledgeSearchResults />);
    expect(getKnowledgeBaseListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.ant-pagination-item-2'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getKnowledgeBaseListSpy).toHaveBeenCalledTimes(2);
    expect(getKnowledgeBaseListSpy).toHaveBeenNthCalledWith(
      2,
      {
        keywords,
        page_index: 2,
        page_size: 20,
        tags: [tags]
      },
      { paramsSerializer }
    );
  });

  it('render toggle paging size', async () => {
    sqleSuperRender(<KnowledgeSearchResults />);
    expect(getKnowledgeBaseListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('span[title="20 条/页"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="10 条/页"]'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getKnowledgeBaseListSpy).toHaveBeenCalledTimes(2);
    expect(getKnowledgeBaseListSpy).toHaveBeenNthCalledWith(
      2,
      {
        keywords,
        page_index: 1,
        page_size: 10,
        tags: [tags]
      },
      { paramsSerializer }
    );
  });

  it('render modify search test and tags', async () => {
    sqleSuperRender(<KnowledgeSearchResults />);
    expect(getKnowledgeBaseListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    const inputEle = getBySelector('textarea.ant-input');
    fireEvent.change(inputEle, {
      target: {
        value: 'CREATE'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('已选择标签(1)'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('RAND'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.search-icon'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getKnowledgeBaseListSpy).toHaveBeenCalledTimes(2);
    expect(getKnowledgeBaseListSpy).toHaveBeenNthCalledWith(
      2,
      {
        keywords: 'CREATE',
        page_index: 1,
        page_size: 20,
        tags: ['RAND']
      },
      { paramsSerializer }
    );
  });
});
