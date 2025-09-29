import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import CopyButton from '../CopyButton';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { fireEvent, screen, act } from '@testing-library/react';
import { Copy } from '@actiontech/dms-kit';

describe('CopyButton', () => {
  const mockContent = 'SELECT * FROM users WHERE id = 1';
  let copyTextByTextareaSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();

    copyTextByTextareaSpy = jest
      .spyOn(Copy, 'copyTextByTextarea')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render with text when onlyIcon is false', () => {
    const { baseElement } = superRender(
      <CopyButton content={mockContent} onlyIcon={false} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with only icon when onlyIcon is true', () => {
    const { baseElement } = superRender(
      <CopyButton content={mockContent} onlyIcon={true} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with default onlyIcon value', () => {
    const { baseElement } = superRender(<CopyButton content={mockContent} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with empty content', () => {
    const { baseElement } = superRender(<CopyButton content="" />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with undefined content', () => {
    const { baseElement } = superRender(<CopyButton />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should call copy function when button is clicked', async () => {
    superRender(<CopyButton content={mockContent} />);

    const copyButton = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(copyButton);
      jest.advanceTimersByTime(3000);
    });

    expect(copyTextByTextareaSpy).toHaveBeenCalledWith(mockContent);
  });

  it('should handle empty content when clicked', async () => {
    superRender(<CopyButton content="" />);

    const copyButton = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(copyButton);
      jest.advanceTimersByTime(3000);
    });

    expect(copyTextByTextareaSpy).toHaveBeenCalledWith('');
  });

  it('should handle undefined content when clicked', async () => {
    superRender(<CopyButton />);

    const copyButton = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(copyButton);
      jest.advanceTimersByTime(3000);
    });

    expect(copyTextByTextareaSpy).toHaveBeenCalledWith('');
  });
});
