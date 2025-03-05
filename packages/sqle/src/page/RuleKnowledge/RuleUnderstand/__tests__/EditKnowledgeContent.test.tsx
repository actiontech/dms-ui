import { act, cleanup, fireEvent } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';
import EditKnowledgeContent from '../EditKnowledgeContent';
import { EditKnowledgeContentProps } from '../index.type';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

jest.mock('rehype-rewrite', () => {
  return {
    getCodeString: jest.fn()
  };
});

describe('page/RuleKnowledge/EditKnowledgeContent', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  const mockChange = jest.fn();
  const mockSetHasDirtyData = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const editKnowledgeProps = {
    value: '',
    onChange: mockChange,
    setHasDirtyData: mockSetHasDirtyData
  };

  const customRender = (data: EditKnowledgeContentProps) => {
    return superRender(<EditKnowledgeContent {...data} />);
  };

  it('render empty content', () => {
    const { baseElement } = customRender(editKnowledgeProps);
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('input')).toBeInTheDocument();
  });

  it('render csutom commands', async () => {
    customRender(editKnowledgeProps);
    expect(getAllBySelector('button')).toHaveLength(2);
    expect(getAllBySelector('button')[0]).toHaveTextContent('label');
    expect(getAllBySelector('button')[1]).toHaveTextContent('Diff');

    fireEvent.click(getAllBySelector('button')[0]);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getAllBySelector('button')[1]);
    await act(async () => jest.advanceTimersByTime(0));
  });

  it('render default content', () => {
    const defaultText = 'edit text';
    const { baseElement } = customRender({
      ...editKnowledgeProps,
      value: defaultText
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('input')).toHaveAttribute('value', defaultText);
  });

  it('input text for edit knowledge content', async () => {
    const inputText = '123';
    const { baseElement } = customRender({
      ...editKnowledgeProps,
      value: inputText
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('input')).toHaveAttribute('value', inputText);
    await act(async () => {
      fireEvent.change(getBySelector('input'), {
        target: {
          value: '1'
        }
      });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockChange).toHaveBeenCalledWith('1');
    expect(mockSetHasDirtyData).toHaveBeenCalledWith(true);
  });
});
