import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { EmptyProps, Spin } from 'antd';
import BasicButton from '../BasicButton';
import { EmptyStyleWrapper } from './style';

export interface IEmptyStyleWrapperProps extends EmptyProps {
  loading?: boolean;
  dataLength?: number;
  errorInfo?: string | ReactNode;
  errorTitle?: string | ReactNode;
  emptyCont?: string | ReactNode;
  onRefresh?: () => void;
}

const BasicEmpty = (props: IEmptyStyleWrapperProps) => {
  const { t } = useTranslation();
  const {
    loading,
    emptyCont,
    errorInfo,
    onRefresh,
    dataLength,
    errorTitle,
    children
  } = props;

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
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 58.5C8 62.6786 22.3 66 40 66C57.7 66 72 62.6786 72 58.5C72 54.3214 57.7 51 40 51C22.2999 51 8 54.3214 8 58.5Z"
              fill="#EBEAE7"
            />
            <path
              d="M54.1761 9.19916C53.4239 8.43216 52.3947 8 51.3204 8H21C18.7909 8 17 9.79086 17 12V56C17 58.2091 18.7909 60 21 60H59C61.2091 60 63 58.2091 63 56V19.8302C63 18.7828 62.5892 17.7772 61.8558 17.0294L54.1761 9.19916Z"
              fill="#F2F1EF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.3501 12.0001C16.3501 9.43197 18.432 7.3501 21.0001 7.3501H51.3204C52.5694 7.3501 53.7658 7.85248 54.6403 8.74413L54.1762 9.19926L54.6403 8.74413L62.3199 16.5744C63.1725 17.4437 63.6501 18.6127 63.6501 19.8303V56.0001C63.6501 58.5682 61.5682 60.6501 59.0001 60.6501H21.0001C18.432 60.6501 16.3501 58.5682 16.3501 56.0001V12.0001ZM21.0001 8.6501C19.1499 8.6501 17.6501 10.1499 17.6501 12.0001V56.0001C17.6501 57.8503 19.1499 59.3501 21.0001 59.3501H59.0001C60.8503 59.3501 62.3501 57.8503 62.3501 56.0001V19.8303C62.3501 18.9531 62.006 18.1109 61.3918 17.4846L53.7121 9.6544C53.0821 9.01203 52.2202 8.6501 51.3204 8.6501H21.0001Z"
              fill="#E6E4E3"
            />
            <path
              d="M52 12.4141C52 11.5232 53.0771 11.077 53.7071 11.707L59.2929 17.2928C59.9229 17.9228 59.4767 18.9999 58.5858 18.9999H53C52.4477 18.9999 52 18.5522 52 17.9999V12.4141Z"
              fill="white"
            />
            <path
              d="M60 42C55.0345 42 51 46.0345 51 51C51 55.9655 55.0345 60 60 60C64.9655 60 69 55.9655 69 51C69.3103 46.0345 65.2759 42 60 42Z"
              fill="#F66074"
            />
            <path
              d="M59.9998 45C60.7527 44.9945 61.5 45.6007 61.5 46.1623L61.1277 51.9757C61.1277 52.5374 60.6199 52.9979 59.9998 52.9979C59.3796 52.9979 58.8727 52.5383 58.8727 51.9757L58.5005 46.1623C58.5005 45.6007 59.0918 45.0205 59.9998 45ZM59.9998 56.9973C59.602 56.9973 59.2205 56.8392 58.9393 56.558C58.658 56.2767 58.5 55.8952 58.5 55.4975C58.5 55.0997 58.658 54.7182 58.9393 54.437C59.2205 54.1557 59.602 53.9977 59.9998 53.9977C60.3974 53.9977 60.7788 54.1557 61.0599 54.4368C61.3411 54.718 61.4991 55.0994 61.4991 55.497C61.4991 55.8947 61.3411 56.276 61.0599 56.5572C60.7788 56.8384 60.3974 56.9963 59.9998 56.9963V56.9973Z"
              fill="white"
            />
            <path
              d="M27 23C27 22.4477 27.4477 22 28 22H39C39.5523 22 40 22.4477 40 23V24C40 24.5523 39.5523 25 39 25H28C27.4477 25 27 24.5523 27 24V23Z"
              fill="white"
            />
            <path
              d="M27 32C27 31.4477 27.4477 31 28 31H52C52.5523 31 53 31.4477 53 32V33C53 33.5523 52.5523 34 52 34H28C27.4477 34 27 33.5523 27 33V32Z"
              fill="white"
            />
            <path
              d="M28 40C27.4477 40 27 40.4477 27 41V42C27 42.5523 27.4477 43 28 43H43C43.5523 43 44 42.5523 44 42V41C44 40.4477 43.5523 40 43 40H28Z"
              fill="white"
            />
          </svg>
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
        iconCom: (
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1412_15009)">
              <path
                d="M0 56.5643C0 61.4398 17.8769 65.3152 40.0043 65.3152C62.1316 65.3152 80.0086 61.4398 80.0086 56.5643C80.0086 51.6887 62.1317 47.8134 40.0043 47.8134C17.8768 47.8134 0 51.6888 0 56.5643Z"
                fill="#EBEAE7"
              />
              <path
                d="M52.0055 35.1869C52.0055 33.1867 53.2557 31.5615 54.7558 31.5615H68.7573V54.189C68.7573 56.8142 67.1322 59.0645 65.132 59.0645H15.0016C13.0014 59.0645 11.2512 56.9393 11.2512 54.189V31.5615H25.2527C26.7528 31.5615 28.003 33.1867 28.003 35.1869C28.003 37.1871 29.2531 38.8123 30.7533 38.8123H49.2553C50.7554 38.8123 52.0055 37.1871 52.0055 35.1869Z"
                fill="#F2F1EF"
              />
              <path
                d="M56.6311 16.56C56.0061 15.4349 55.0059 14.8098 53.6308 14.6848H26.3779C25.1277 14.8098 24.0026 15.4349 23.5026 16.56L10.6262 30.9365V54.189C10.6262 57.1893 12.5014 59.6896 15.0016 59.6896H65.007C67.3823 59.6896 69.2575 57.1893 69.2575 54.189V30.9365L56.6311 16.56ZM24.3777 17.3101C24.8777 16.435 25.5028 16.0599 26.3779 15.935H53.6308C54.5059 15.935 55.131 16.435 55.506 17.1851L67.6323 30.9365H54.7559C52.8807 30.9365 51.3805 32.8117 51.3805 35.187C51.3805 36.8122 50.3804 38.1873 49.2553 38.1873H30.7533C29.5032 38.1873 28.6281 36.8122 28.6281 35.187C28.6281 32.8117 27.128 30.9365 25.2528 30.9365H12.3763L24.3777 17.3101ZM68.1323 54.189C68.1323 56.4393 66.7572 58.4395 65.132 58.4395H15.0016C13.2515 58.4395 11.8763 56.5643 11.8763 54.189V32.1867H25.2528C26.3779 32.1867 27.378 33.5618 27.378 35.312C27.378 37.6873 28.8781 39.5625 30.7533 39.5625H49.2553C51.1306 39.5625 52.6307 37.6873 52.6307 35.312C52.6307 33.6868 53.6308 32.3117 54.7559 32.3117H68.0073V54.189H68.1323Z"
                fill="#E6E4E3"
              />
            </g>
            <defs>
              <clipPath id="clip0_1412_15009">
                <rect width="80" height="80" fill="white" />
              </clipPath>
            </defs>
          </svg>
        ),
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
      {!loading && children}
    </EmptyStyleWrapper>
  );
};

export default BasicEmpty;
