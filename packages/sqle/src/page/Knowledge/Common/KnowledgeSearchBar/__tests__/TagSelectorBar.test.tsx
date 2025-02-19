import { act, cleanup, screen, fireEvent } from '@testing-library/react';
import TagSelectorBar from '../TagSelectorBar';
import { superRender } from '../../../../../testUtils/customRender';
import knowledgeBase from '../../../../../testUtils/mockApi/knowledgeBase';
import { mockKnowledgeBaseTagListData } from '../../../../../testUtils/mockApi/knowledgeBase/data';
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
    const { container } = superRender(
      <TagSelectorBar value={['RAND']} onChange={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
    expect(getKnowledgeBaseTagList).toHaveBeenCalled();
  });

  it('render select tag', async () => {
    const onChangeSpy = jest.fn();
    const { baseElement } = superRender(
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
    superRender(<TagSelectorBar value={['RAND']} onChange={onChangeSpy} />);
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
