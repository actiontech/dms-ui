import { fireEvent } from '@testing-library/dom';
import { getBySelector } from '../../../testUtil/customQuery';
import { superRender } from '../../../testUtil/customRender';
import Snippet from '../component/Snippet';
import { SQLSnippetRendererProps } from '../index.type';

describe('test SQLRenderer.Snippet', () => {
  const customRender = (params?: Partial<SQLSnippetRendererProps>) => {
    return superRender(
      <Snippet
        sql={`CREATE TABLE IF NOT EXISTS
    task (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT,
      status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`}
        {...params}
      />
    );
  };

  it('render snap', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();
  });

  it('render snap when tooltip is equal false', () => {
    const { container } = customRender({ tooltip: false });
    expect(container).toMatchSnapshot();
  });

  it('render showCopyIcon is equal hover', () => {
    customRender({ showCopyIcon: 'hover' });
    expect(getBySelector('.copy-icon-hover')).toBeInTheDocument();
  });

  it('should call onClick when clicked sql wrapper', () => {
    const onClick = jest.fn();

    customRender({ onClick, className: 'custom-wrapper' });

    fireEvent.click(getBySelector('.actiontech-sql-snippet-renderer-wrapper'));

    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.click(getBySelector('.custom-wrapper'));

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('render snap when loading is not undefined', () => {
    expect(customRender({ loading: false }).container).toMatchSnapshot();
    expect(customRender({ loading: true }).container).toMatchSnapshot();
  });

  it('render empty content', () => {
    expect(customRender({ sql: '' }).container).toMatchSnapshot();
    expect(
      customRender({ sql: '', emptySqlContent: 'empty' }).container
    ).toMatchSnapshot();
  });

  it('render snap when maxLength is 200', () => {
    const { container } = customRender({ maxLength: 200 });
    expect(container).toMatchSnapshot();
  });
});
