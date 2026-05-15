import ProjectSelector from '..';
import { ProjectSelectorProps } from '../index.type';

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

const mockBindProjects = [
  {
    project_id: '1',
    project_name: 'test1',
    archived: true
  },
  {
    project_id: '2',
    project_name: 'test2',
    archived: false
  }
];

const mockOptions = [
  {
    value: '1',
    label: 'test1'
  },
  {
    value: '2',
    label: 'test2'
  },
  {
    value: '3',
    label: 'test3'
  }
];

describe('base/page/Nav/SideMenu/ProjectSelector', () => {
  const onChangeFn = jest.fn();
  const customRender = (
    bindProjects: ProjectSelectorProps['bindProjects'] = [],
    options: ProjectSelectorProps['options'] = [],
    value: ProjectSelectorProps['value'] = ''
  ) => {
    return baseSuperRender(
      <ProjectSelector
        value={value}
        prefix={<span>prefix node</span>}
        onChange={onChangeFn}
        options={options}
        bindProjects={bindProjects}
      />,
      {}
    );
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when no data', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has data', async () => {
    const { baseElement } = customRender(mockBindProjects, mockOptions, '1');
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(getBySelector('.ant-select-selector'));

    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseEnter(screen.getAllByText('test2')[0]);
    await act(async () => jest.advanceTimersByTime(500));

    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseLeave(screen.getAllByText('test2')[0]);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(getBySelector('#rc_select_TEST_OR_SSR', baseElement), {
      target: {
        value: '1'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when clicked more projects button', async () => {
    const { baseElement } = customRender();

    fireEvent.mouseDown(getBySelector('.ant-select-selector'));

    expect(screen.queryByText('查看更多项目')).toBeInTheDocument();

    fireEvent.change(getBySelector('.ant-input'), {
      target: { value: 'search value' }
    });

    fireEvent.click(screen.getByText('查看更多项目'));

    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when closed select dropdown', async () => {
    const { baseElement } = customRender();

    fireEvent.mouseDown(getBySelector('.ant-select-selector'));

    fireEvent.change(getBySelector('.ant-input'), {
      target: { value: 'search value' }
    });

    fireEvent.mouseDown(getBySelector('.ant-select-selector'));

    expect(baseElement).toMatchSnapshot();
  });
});
