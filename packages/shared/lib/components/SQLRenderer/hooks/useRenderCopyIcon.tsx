import classNames from 'classnames';
import { SQLRendererProps } from '../index.type';
import { useCallback } from 'react';
import CopyIcon from '../../CopyIcon';

const useRenderCopyIcon = (params: SQLRendererProps) => {
  const { showCopyIcon, onCopyComplete, sql, copyIconClassName } = params;
  const renderCopyIcon = useCallback(() => {
    if (!showCopyIcon || !sql) {
      return null;
    }

    return (
      <CopyIcon
        text={sql}
        onCopy={onCopyComplete}
        className={classNames(
          copyIconClassName,
          'actiontech-sql-renderer-copy-icon'
        )}
      />
    );
  }, [copyIconClassName, onCopyComplete, showCopyIcon, sql]);

  return {
    renderCopyIcon
  };
};

export default useRenderCopyIcon;
