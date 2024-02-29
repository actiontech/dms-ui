import ProjectSelector from '..';
import { ProjectSelectorProps } from '../index.type';

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

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
    label: 'testA'
  },
  {
    value: '2',
    label: 'testB'
  }
];

describe('base/page/Nav/SideMenu/ProjectSelector', () => {
  const onChangeFn = jest.fn();
  const customRender = (
    bindProjects: ProjectSelectorProps['bindProjects'] = [],
    options: ProjectSelectorProps['options'] = [],
    value: ProjectSelectorProps['value'] = ''
  ) => {
    return superRender(
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

  beforeEach(() => {
    jest.useFakeTimers();
    //  Warning: React does not recognize the `searchInputRef` prop on a DOM element.
    jest.spyOn(console, 'error').mockImplementation(() => {});
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

    const dropDownIcon = getBySelector(
      '.custom-icon-right-arrow-select-suffix',
      baseElement
    );
    fireEvent.click(dropDownIcon);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('testA')).toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText('testA'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseLeave(screen.getByText('testA'));
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
});
