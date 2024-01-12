import { renderWithTheme } from '../../../../testUtils/customRender';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

import BaseInfoTag from './BaseInfoTag';

describe('sqle/Order/Create/BaseInfoTag', () => {
  beforeEach(() => {
    MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('render snap', () => {
    const { baseElement } = renderWithTheme(
      <BaseInfoTag projectName="project name" username="username" />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
