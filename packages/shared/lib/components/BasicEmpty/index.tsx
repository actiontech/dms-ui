import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { EmptyProps, Spin } from 'antd5';
import Icon from '@ant-design/icons/lib/components/Icon';
import { IconEmpty, IconError } from '../../Icon/common';
import BasicButton from '../BasicButton';
import { EmptyStyleWrapper } from './style';

interface IEmptyStyleWrapperProps extends EmptyProps {
  loading?: boolean;
  dataLength?: number;
  errorInfo?: string | ReactNode;
  errorTitle?: string | ReactNode;
  emptyCont?: string | ReactNode;
  onRefresh?: () => void;
}

const BasicEmpty = (props: IEmptyStyleWrapperProps) => {
  const { t } = useTranslation();
  const { loading, emptyCont, errorInfo, onRefresh, dataLength, errorTitle } =
    props;

  const { type, iconCom, noteTip, noteTitle } = useMemo(() => {
    if (loading) {
      return {
        type: 'loading',
        iconCom: <Spin spinning={true} />,
        noteTitle: '',
        noteTip: ''
      };
    }
    if (errorInfo) {
      const errorTypeString = typeof errorInfo === 'string';
      return {
        type: 'error',
        iconCom: errorTypeString ? (
          <Icon component={IconError} />
        ) : (
          <>{errorInfo}</>
        ),
        noteTitle: errorTitle,
        noteTip: errorTypeString ? errorInfo : t('common.tip.net_error')
      };
    }
    if (!dataLength) {
      return {
        type: 'empty',
        iconCom: <Icon component={IconEmpty} />,
        noteTitle: '',
        noteTip: emptyCont ?? t('common.tip.no_data')
      };
    }
    return {
      type: 'has-data',
      iconCom: undefined,
      noteTitle: '',
      noteTip: ''
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorInfo, emptyCont, dataLength, t, loading]);

  return (
    <EmptyStyleWrapper
      image={iconCom}
      description={
        <>
          {noteTitle ? (
            <span className="no-data-title">{noteTitle}</span>
          ) : null}
          {noteTip ? (
            <span
              className={classNames({
                'no-data-cont': true,
                'tip-without-title': !!onRefresh && !noteTitle
              })}
            >
              {noteTip}
            </span>
          ) : null}
        </>
      }
      className={classNames({
        'is-icon-tips': ['error', 'empty'].includes(type),
        'is-icon-loading': type === 'loading'
      })}
    >
      {onRefresh && !loading && (
        <BasicButton onClick={onRefresh} type="text" size="small">
          {t('common.refresh')}
        </BasicButton>
      )}
    </EmptyStyleWrapper>
  );
};

export default BasicEmpty;
