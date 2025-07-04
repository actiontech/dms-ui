import { act, cleanup, screen, fireEvent } from '@testing-library/react';
import TagSelectorBar from '../TagSelectorBar';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import knowledgeBase from '@actiontech/shared/lib/testUtil/mockApi/sqle/knowledgeBase';
import { mockKnowledgeBaseTagListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/knowledgeBase/data';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

describe('TagSelectorBar', () => {
  let getKnowledgeBaseTagList: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getKnowledgeBaseTagList = knowledgeBase.getKnowledgeBaseTagList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', () => {
    const { container } = sqleSuperRender(
      <TagSelectorBar value={['RAND']} onChange={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
    expect(getKnowledgeBaseTagList).toHaveBeenCalled();
  });

  it('render select tag', async () => {
    const onChangeSpy = jest.fn();
    const { baseElement } = sqleSuperRender(
      <TagSelectorBar value={[]} onChange={onChangeSpy} />
    );
    expect(getKnowledgeBaseTagList).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('已选择标签(0)'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(getBySelector('.ant-input'), {
      target: {
        value: 'rand'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('RAND')).toBeInTheDocument();
    expect(getAllBySelector('.hidden-checkbox')).toHaveLength(
      mockKnowledgeBaseTagListData.length - 1
    );
    fireEvent.click(getAllBySelector('.ant-checkbox-input')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(['RAND']);
  });

  it('render delete tag', async () => {
    const onChangeSpy = jest.fn();
    sqleSuperRender(<TagSelectorBar value={['RAND']} onChange={onChangeSpy} />);
    expect(getKnowledgeBaseTagList).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('已选择标签(1)')).toBeInTheDocument();
    expect(screen.getByText('RAND')).toBeInTheDocument();

    fireEvent.click(getBySelector('.anticon-close'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith([]);
  });
});
