import { act, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import ProjectSelectorModal from '../ProjectSelectorModal';
import { ProjectSelectorModalProps } from '../index.type';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('test base/page/project/detail/notFoundRecentlyProject/ProjectSelectorModal', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  const param: ProjectSelectorModalProps = {
    onModalCancel: jest.fn(),
    onModalOk: jest.fn(),
    open: true,
    projectSelectorOptions: [
      { value: '1', label: 'test1' },
      { value: '2', label: 'test2' }
    ],
    projectSelectorValue: '1',
    setProjectSelectorValue: jest.fn()
  };
  const customRender = (open = true) => {
    return baseSuperRender(<ProjectSelectorModal {...param} open={open} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot when render dropdown', async () => {
    const { baseElement } = customRender();

    fireEvent.mouseDown(getBySelector('.ant-select-selector'), baseElement);
    await act(async () => jest.advanceTimersByTime(0));

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('项目列表')).toBeInTheDocument();
  });

  it('should executed "onModalCancel" and "onModalOk" when clicked modal footer button', () => {
    customRender();
    expect(param.onModalCancel).toHaveBeenCalledTimes(0);
    expect(param.onModalOk).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('取 消'));
    expect(param.onModalCancel).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('确 认'));
    expect(param.onModalOk).toHaveBeenCalledTimes(1);
  });
});
