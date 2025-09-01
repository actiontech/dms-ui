import { fireEvent } from '@testing-library/dom';
import { getBySelector } from '../../../testUtil/customQuery';
import { superRender } from '../../../testUtil/superRender';
import Snippet from '../component/Snippet';
import { SQLSnippetRendererProps } from '../SQLRenderer.types';
import { Copy } from '@actiontech/dms-kit';
import { act } from '@testing-library/react';

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

  it('render snap when basic props are set', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();
  });

  it('render snap when loading is not undefined', () => {
    expect(customRender({ loading: true }).container).toMatchSnapshot();
  });

  it('render snap when sql is empty', () => {
    expect(
      customRender({ sql: '', emptySqlContent: 'empty' }).container
    ).toMatchSnapshot();
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

  it('should call onCopyComplete when copy icon is clicked', async () => {
    jest.useFakeTimers();
    jest.spyOn(Copy, 'copyTextByTextarea').mockImplementation(jest.fn());
    const onCopyComplete = jest.fn();
    customRender({ showCopyIcon: true, onCopyComplete });
    fireEvent.click(getBySelector('.actiontech-sql-renderer-copy-icon'));

    await act(async () => jest.advanceTimersByTime(0));
    expect(onCopyComplete).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('should render with custom paragraph props', () => {
    customRender({
      paragraph: {
        className: 'custom-paragraph',
        style: { color: 'red' }
      }
    });
    expect(getBySelector('.custom-paragraph')).toBeInTheDocument();
    expect(getBySelector('.custom-paragraph')).toHaveStyle({ color: 'red' });
  });

  it('should not highlight syntax when highlightSyntax is false', () => {
    const { container } = customRender({ highlightSyntax: false });
    expect(container.querySelector('.hljs')).not.toBeInTheDocument();
  });

  it('should slice sql content when cuttingLength is set', () => {
    const sql = 'SELECT * FROM table';
    const { container } = customRender({ sql, cuttingLength: 10 });
    expect(container.textContent).toContain('SELECT * F');
  });
});
