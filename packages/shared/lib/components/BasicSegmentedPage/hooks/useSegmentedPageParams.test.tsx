import {
  renderHooksWithTheme,
  renderWithReduxAndTheme
} from '../../../testUtil/customRender';
import { cleanup, act } from '@testing-library/react';
import useSegmentedPageParams from './useSegmentedPageParams';

describe('lib/BasicSegmentedPage/useBasicSegmentedPageParams', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snapshot for render method', async () => {
    const { result } = renderHooksWithTheme(() =>
      useSegmentedPageParams<string>()
    );
    expect(result.current.options).toEqual([]);
    expect(result.current.value).toBeUndefined();
    const mockOption = {
      label: 'test1',
      value: 'test2'
    };
    await act(async () => {
      result.current.updateSegmentedPageData([
        {
          ...mockOption,
          content: 'content',
          extraButton: 'button'
        }
      ]);
      jest.advanceTimersByTime(3000);
    });
    const { baseElement } = renderWithReduxAndTheme(
      <>
        {result.current.renderContent()}
        {result.current.renderExtraButton()}
      </>
    );
    expect(baseElement).toMatchSnapshot();
    expect(result.current.value).toEqual('test2');
    expect(result.current.options).toEqual([mockOption]);
  });
});
