import classNames from 'classnames';
import { SQLRendererProps } from '../SQLRenderer.types';
import { useCallback } from 'react';
import Copy from '../../../utils/Copy';
import { CopyIcon } from '../../CopyIcon';

const useRenderCopyIcon = (
  params: Pick<
    SQLRendererProps,
    'showCopyIcon' | 'onCopyComplete' | 'sql' | 'copyIconClassName'
  >
) => {
  const { showCopyIcon, onCopyComplete, sql, copyIconClassName } = params;
  const renderCopyIcon = useCallback(() => {
    if (!showCopyIcon || !sql) {
      return null;
    }

    const onCopyExecSql = () => {
      try {
        navigator.clipboard.writeText(sql);
      } catch (err) {
        Copy.copyTextByTextarea(sql);
      }
    };

    return (
      <CopyIcon
        text={sql}
        onCopyComplete={onCopyComplete}
        className={classNames(
          copyIconClassName,
          'actiontech-sql-renderer-copy-icon'
        )}
        onCustomCopy={onCopyExecSql}
      />
    );
  }, [copyIconClassName, onCopyComplete, showCopyIcon, sql]);

  return {
    renderCopyIcon
  };
};

export default useRenderCopyIcon;
