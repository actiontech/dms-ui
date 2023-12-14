import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../../testUtils/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../data/ModalName';
import userManagement from '../../../../../../testUtils/mockApi/userManagement';
import EllipsisModal from './index';
import { userScopeData } from '../../../../../../testUtils/mockApi/userManagement/data';

describe('diagnosis/ellipsis modal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render scope data less than 3', async () => {
    const { container } = superRender(<EllipsisModal data={userScopeData} />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(container).toMatchSnapshot();
    expect(getBySelector('.anticon-ellipsis')).toBeInTheDocument();
    expect(getAllBySelector('.anticon-ellipsis').length).toBe(1);
    fireEvent.mouseOver(getBySelector('.anticon-ellipsis'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.ant-tooltip')).toBeInTheDocument();
    expect(getAllBySelector('.ant-tag').length).toBe(3);
  });
});
