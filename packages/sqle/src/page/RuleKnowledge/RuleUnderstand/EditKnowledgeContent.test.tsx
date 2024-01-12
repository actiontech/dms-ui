import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import EditKnowledgeContent from './EditKnowledgeContent';
import { EditKnowledgeContentProps } from './index.type';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';

jest.mock('rehype-sanitize', () => () => jest.fn());

describe('page/RuleKnowledge/EditKnowledgeContent', () => {
  ignoreComponentCustomAttr();

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
    expect(mockChange).toBeCalledWith('1');
    expect(mockSetHasDirtyData).toBeCalledWith(true);
  });
});
