import { fireEvent } from '@testing-library/dom';
import { getBySelector, queryBySelector } from '../../../testUtil/customQuery';
import { superRender } from '../../../testUtil/customRender';
import SQLRenderer from '../SQLRenderer';
import { SQLRendererProps } from '../SQLRenderer.types';
import { act, cleanup } from '@testing-library/react';

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

  it('should render with different showCopyIcon values', () => {
    expect(
      customRender({ showCopyIcon: 'always' }).container
    ).toMatchSnapshot();
  });

  it('should call onClick when clicked sql wrapper', () => {
    const onClick = jest.fn();
    customRender({ onClick, className: 'custom-wrapper' });
    fireEvent.click(getBySelector('.actiontech-sql-renderer-wrapper'));
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.custom-wrapper'));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('should render with different props configurations', () => {
    expect(customRender({ loading: true }).container).toMatchSnapshot();

    const { container } = customRender({
      sql: '',
      emptySqlContent: 'empty',
      preserveOriginalFormat: false,
      highlightSyntax: false,
      showLineNumbers: true
    });
    expect(container).toMatchSnapshot();
  });

  it('should apply word-wrap class when wordWrap is true', () => {
    customRender();

    expect(queryBySelector('.word-wrap')).not.toBeInTheDocument();

    cleanup();

    const { container } = customRender({
      sql: `CREATE TABLE IF NOT EXISTS task (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255) NOT NULL DEFAULT '', description TEXT, status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);`,
      wordWrap: true
    });

    expect(getBySelector('.word-wrap')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
