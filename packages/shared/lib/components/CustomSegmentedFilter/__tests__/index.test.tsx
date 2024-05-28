import { fireEvent, screen } from '@testing-library/dom';
import CustomSegmentedFilter from '..';
import { superRender } from '../../../testUtil/customRender';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '../../../testUtil/common';

describe('test CustomSegmentedFilter', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  it('renders CustomSegmentedFilter component', () => {
    const { container } = superRender(
      <CustomSegmentedFilter
        options={['option1', 'option2']}
        defaultValue="option1"
        className="custom-class-name"
        style={{ color: 'red' }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders options correctly with labelDictionary', () => {
    superRender(
      <CustomSegmentedFilter
        options={['option1', 'option2']}
        labelDictionary={{ option1: 'Option 1', option2: 'Option 2' }}
      />
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders options correctly with labelDictionary and options is object', () => {
    const handleChange = jest.fn();

    superRender(
      <CustomSegmentedFilter
        options={[
          { label: 'option1', value: 'a1' },
          { label: 'option2', value: 'a2' }
        ]}
        labelDictionary={{ option1: 'Option 1', option2: 'Option 2' }}
        onChange={handleChange}
      />
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Option 2'));
    expect(handleChange).toHaveBeenCalledWith('a2');
  });

  it('includes "all" option when withAll is true', () => {
    const handleChange = jest.fn();

    superRender(
      <CustomSegmentedFilter
        options={['option1']}
        withAll={true}
        onChange={handleChange}
        defaultValue="option1"
      />
    );
    expect(screen.getByText('全部')).toBeInTheDocument();

    fireEvent.click(screen.getByText('全部'));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByText('全部').parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );
  });

  it('includes "all" option when withAll is string', () => {
    const handleChange = jest.fn();
    superRender(
      <CustomSegmentedFilter
        options={['option1']}
        withAll="全部2"
        onChange={handleChange}
        defaultValue="option1"
      />
    );
    expect(screen.getByText('全部2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('全部2'));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('全部2');
  });

  it('includes "all" option when withAll is object', () => {
    const handleChange = jest.fn();
    superRender(
      <CustomSegmentedFilter
        options={['option1']}
        withAll={{ label: '全部3', value: 'all' }}
        onChange={handleChange}
        defaultValue="option1"
      />
    );
    expect(screen.getByText('全部3')).toBeInTheDocument();
    fireEvent.click(screen.getByText('全部3'));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('all');
  });

  it('handles option click', () => {
    const handleChange = jest.fn();
    superRender(
      <CustomSegmentedFilter
        options={[
          { label: '选项1', value: 'option1' },
          { label: '选项2', value: 'option2' }
        ]}
        onChange={handleChange}
      />
    );
    fireEvent.click(screen.getByText('选项2'));
    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('renders without styles when noStyle is true', () => {
    const handleChange = jest.fn();
    const { container } = superRender(
      <CustomSegmentedFilter
        options={['option1', 'option2']}
        noStyle={true}
        className="no-style-wrapper"
        defaultValue="option2"
        onChange={handleChange}
      />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('option1'));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('option1');
  });
});
