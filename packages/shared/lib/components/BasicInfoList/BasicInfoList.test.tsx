import { superRender } from '../../testUtil/customRender';
import BasicEmpty from '../BasicEmpty/BasicEmpty';
import BasicInfoList from './BasicInfoList';
import { BasicInfoListProps } from './BasicInfoList.types';
import { screen } from '@testing-library/react';

jest.mock('../BasicEmpty/BasicEmpty', () => {
  return jest.fn().mockImplementation(() => null);
});

describe('lib/BasicInfoList', () => {
  const customRender = (params: BasicInfoListProps) => {
    return superRender(<BasicInfoList {...params} />);
  };

  beforeEach(() => {
    (BasicEmpty as jest.Mock).mockClear();
  });

  it('should match snapshot', () => {
    const { container } = customRender({
      loading: false,
      data: []
    });
    expect(container).toMatchSnapshot();
  });

  describe('when rendering different states', () => {
    it('should show loading state correctly', () => {
      customRender({
        loading: true,
        data: []
      });
      expect(BasicEmpty).toHaveBeenCalledWith(
        expect.objectContaining({
          loading: true
        }),
        expect.any(Object)
      );
    });

    it('should show empty state correctly', () => {
      customRender({
        loading: false,
        data: []
      });
      expect(BasicEmpty).toHaveBeenCalledWith(
        expect.objectContaining({
          dataLength: 0
        }),
        expect.any(Object)
      );
    });

    it('should show error state correctly', () => {
      const errorMessage = 'error str';
      customRender({
        loading: false,
        data: [],
        errorInfo: errorMessage
      });
      expect(BasicEmpty).toHaveBeenCalledWith(
        expect.objectContaining({
          errorInfo: errorMessage
        }),
        expect.any(Object)
      );
    });
  });

  it('should render title correctly', () => {
    const title = 'info list 标题';
    customRender({
      loading: false,
      title,
      data: []
    });
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  describe('when rendering content', () => {
    it('should render grid items with correct layout for default column number', () => {
      const testData = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' }
      ];
      const { container } = customRender({
        loading: false,
        data: testData
      });
      const gridItems = container.querySelectorAll('.info-item-wrapper');
      expect(gridItems).toHaveLength(3);
      expect(gridItems[0]).toHaveStyle({ width: '33.333333333333336%' });
    });

    it('should render grid items with custom column number', () => {
      const testData = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' }
      ];
      const { container } = customRender({
        loading: false,
        columnNumber: 2,
        data: testData
      });
      const gridItems = container.querySelectorAll('.info-item-wrapper');
      expect(gridItems).toHaveLength(2);
      expect(gridItems[0]).toHaveStyle({ width: '50%' });
    });

    it('should render key-value pairs correctly', () => {
      const testData = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' }
      ];
      customRender({
        loading: false,
        data: testData
      });
      testData.forEach((item) => {
        expect(screen.getByText(item.key)).toBeInTheDocument();
        expect(screen.getByText(item.value)).toBeInTheDocument();
      });
    });
  });
});
