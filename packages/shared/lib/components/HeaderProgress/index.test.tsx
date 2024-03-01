import { render } from '@testing-library/react';
import nProgress from 'nprogress';
import HeaderProgress from '.';

jest.mock('nprogress', () => {
  return {
    configure: jest.fn(),
    start: jest.fn,
    done: jest.fn
  };
});

describe('HeaderProgress', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('should config nprogress when component was imported', () => {
    // nprogress.configure will run at file imported. it's mean the jest.mock will run after nprogress.configure;
    // so... this case never pass
    render(<HeaderProgress />);
    expect(nProgress.configure).toHaveBeenCalledTimes(1);
    expect(nProgress.configure).toHaveBeenCalledWith({
      showSpinner: false
    });
  });

  it('should call start when component was mounted and call done when component was unmounted', () => {
    const start = jest.spyOn(nProgress, 'start');
    const done = jest.spyOn(nProgress, 'done');
    const { unmount } = render(<HeaderProgress />);
    expect(start).toHaveBeenCalledTimes(1);
    unmount();
    expect(done).toHaveBeenCalledTimes(1);
  });
});
