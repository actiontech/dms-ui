import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LanguageSelect from '.';
import { useSelector } from 'react-redux';
import { SupportLanguage } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('LanguageSelect', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        locale: {
          language: SupportLanguage.zhCN
        }
      });
    });
  });
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  test('should render all support language option in select', async () => {
    const { baseElement } = render(<LanguageSelect />);
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(screen.getByText('中文'));
    await waitFor(async () => {
      await screen.findByText('English');
    });
    expect(baseElement).toMatchSnapshot();
  });
});
