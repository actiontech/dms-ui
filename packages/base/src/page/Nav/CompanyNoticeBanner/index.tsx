import { useEffect, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { NotificationFilled } from '@ant-design/icons';
import { BasicModal, BasicButton } from '@actiontech/dms-kit';
import CompanyNotice from '@actiontech/shared/lib/api/base/service/CompanyNotice';
import { ResponseCode } from '@actiontech/dms-kit';
import {
  CompanyNoticeBannerStyleWrapper,
  CompanyNoticeDetailContentStyleWrapper
} from './style';

const CompanyNoticeBanner: React.FC = () => {
  const { t } = useTranslation();
  const textRef = useRef<HTMLSpanElement>(null);
  const [needExpand, setNeedExpand] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { data: noticeStr } = useRequest(
    () =>
      CompanyNotice.GetCompanyNotice({
        include_latest_outside_period: false
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data?.notice_str ?? '';
        }
      }),
    {
      pollingInterval: 60 * 1000
    }
  );

  useEffect(() => {
    const el = textRef.current;
    if (!el || !noticeStr) return;

    const checkOverflow = () => {
      setNeedExpand(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [noticeStr]);

  if (!noticeStr) {
    return null;
  }

  return (
    <>
      <CompanyNoticeBannerStyleWrapper>
        <span className="notice-label">
          <NotificationFilled className="notice-label-icon" />
          <span>{t('dmsSystem.notification.title')}</span>
        </span>
        <div className="notice-content-area">
          <span ref={textRef} className="notice-text">
            {noticeStr}
          </span>
          {needExpand && (
            <span
              className="notice-expand-btn"
              role="button"
              tabIndex={0}
              onClick={() => setDetailModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDetailModalOpen(true);
                }
              }}
            >
              {t('dmsSystem.notification.viewFullContent')}
            </span>
          )}
        </div>
      </CompanyNoticeBannerStyleWrapper>

      <BasicModal
        title={t('dmsSystem.notification.title')}
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={
          <BasicButton type="primary" onClick={() => setDetailModalOpen(false)}>
            {t('common.close')}
          </BasicButton>
        }
        width={560}
      >
        <CompanyNoticeDetailContentStyleWrapper>
          {noticeStr}
        </CompanyNoticeDetailContentStyleWrapper>
      </BasicModal>
    </>
  );
};

export default CompanyNoticeBanner;
