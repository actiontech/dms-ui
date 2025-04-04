import { fireEvent } from '@testing-library/dom';
import { getBySelector, queryBySelector } from '../../../testUtil/customQuery';
import { superRender } from '../../../testUtil/customRender';
import SQLRenderer from '../SQLRenderer';
import { SQLRendererProps } from '../SQLRenderer.types';
import { act } from '@testing-library/react';

describe('test SQLRenderer', () => {
  const customRender = (params?: Partial<SQLRendererProps>) => {
    return superRender(
      <SQLRenderer
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
  it('render showCopyIcon is equal true', async () => {
    document.execCommand = jest.fn();
    const onCopyComplete = jest.fn();
    customRender({
      showCopyIcon: true,
      copyIconClassName: 'custom-copy-icon',
      onCopyComplete
    });

    expect(
      getBySelector('.actiontech-sql-renderer-copy-icon')
    ).toBeInTheDocument();

    expect(getBySelector('.custom-copy-icon')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getBySelector('.custom-copy-icon'));
    });

    expect(onCopyComplete).toHaveBeenCalledTimes(1);

    const writeText = jest.fn();

    Object.assign(navigator, {
      clipboard: {
        writeText
      }
    });

    await act(async () => {
      fireEvent.click(getBySelector('.custom-copy-icon'));
    });

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(onCopyComplete).toHaveBeenCalledTimes(2);

    Object.assign(navigator, {
      clipboard: undefined
    });
  });

  it('render showCopyIcon is equal hover', () => {
    customRender({ showCopyIcon: 'hover' });
    expect(getBySelector('.copy-icon-hover')).toBeInTheDocument();
  });

  it('render showCopyIcon is equal always', () => {
    expect(
      customRender({ showCopyIcon: 'always' }).container
    ).toMatchSnapshot();
  });

  it('render showCopyIcon is equal true and sql is empty', () => {
    customRender({ showCopyIcon: true, sql: '' });
    expect(
      queryBySelector('.actiontech-sql-renderer-copy-icon')
    ).not.toBeInTheDocument();
  });

  it('should call onClick when clicked sql wrapper', () => {
    const onClick = jest.fn();

    customRender({ onClick, className: 'custom-wrapper' });

    fireEvent.click(getBySelector('.actiontech-sql-renderer-wrapper'));

    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.click(getBySelector('.custom-wrapper'));

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('render snap when loading is not undefined', () => {
    expect(customRender({ loading: false }).container).toMatchSnapshot();
    expect(customRender({ loading: true }).container).toMatchSnapshot();
  });

  it('render snap when preserveOriginalFormat is equal false', () => {
    expect(
      customRender({ preserveOriginalFormat: false }).container
    ).toMatchSnapshot();
  });

  it('render empty content', () => {
    expect(customRender({ sql: '' }).container).toMatchSnapshot();
    expect(
      customRender({ sql: '', emptySqlContent: 'empty' }).container
    ).toMatchSnapshot();
  });

  it('render snap when highlightSyntax is equal false', () => {
    expect(
      customRender({ highlightSyntax: false }).container
    ).toMatchSnapshot();
  });

  it('render snap when showLineNumbers is equal true', () => {
    expect(customRender({ showLineNumbers: true }).container).toMatchSnapshot();
  });
});
