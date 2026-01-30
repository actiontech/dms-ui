import * as useMedia from '../../hooks/useMedia';

export const mockUseMedia = (
  mockData?: Partial<ReturnType<typeof useMedia.default>>
) => {
  const spy = jest.spyOn(useMedia, 'default');
  spy.mockImplementation(() => ({
    isMobile: mockData?.isMobile ?? false,
    isSmallMobile: mockData?.isSmallMobile ?? false
  }));
  return spy;
};
