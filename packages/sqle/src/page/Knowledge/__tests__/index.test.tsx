import { act, cleanup, screen, fireEvent } from '@testing-library/react';
import KnowledgeSearchResults from '../index';
import { sqleSuperRender } from '../../../testUtils/superRender';
import knowledgeBase from '../../../testUtils/mockApi/knowledgeBase';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('Knowledge', () => {
  let getKnowledgeGraphSpy: jest.SpyInstance;
  const navigateSpy = jest.fn();
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE]);

  beforeEach(() => {
    jest.useFakeTimers();
    getKnowledgeGraphSpy = knowledgeBase.getKnowledgeGraph();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = sqleSuperRender(<KnowledgeSearchResults />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getKnowledgeGraphSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('search knowledge base', async () => {
    sqleSuperRender(<KnowledgeSearchResults />);
    await act(async () => jest.advanceTimersByTime(3000));
    const inputEle = getBySelector('textarea.ant-input');
    fireEvent.change(inputEle, {
      target: {
        value: 'SELECT'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.search-icon'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      '/sqle/knowledge/refined?keywords=SELECT'
    );
  });

  it('search knowledge base with empty text', async () => {
    sqleSuperRender(<KnowledgeSearchResults />);
    await act(async () => jest.advanceTimersByTime(3000));
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
});
