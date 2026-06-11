import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const MARQUEE_GAP = 32;
const MARQUEE_MIN_DURATION = 8;
const MARQUEE_MAX_DURATION = 60;
const MARQUEE_SPEED = 40;

const clamp = (min: number, max: number, value: number) =>
  Math.min(max, Math.max(min, value));

const CompanyNoticeBanner: React.FC = () => {
  const { t } = useTranslation();
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const [marqueeDuration, setMarqueeDuration] = useState(MARQUEE_MIN_DURATION);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
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

  const displayNoticeStr = useMemo(
    () => (noticeStr ? noticeStr.replace(/\s+/g, ' ').trim() : ''),
    [noticeStr]
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--notice-banner-height',
      noticeStr ? '34px' : '0px'
    );
    return () => {
      document.documentElement.style.setProperty(
        '--notice-banner-height',
        '0px'
      );
    };
  }, [noticeStr]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const container = contentAreaRef.current;
    const measureEl = measureRef.current;
    if (!container || !measureEl || !displayNoticeStr) return;

    const checkOverflow = () => {
      const textWidth = measureEl.scrollWidth;
      const containerWidth = container.clientWidth;
      const overflow = textWidth > containerWidth;
      setShouldMarquee(overflow);
      if (overflow) {
        setMarqueeDuration(
          clamp(
            MARQUEE_MIN_DURATION,
            MARQUEE_MAX_DURATION,
            (textWidth + MARQUEE_GAP) / MARQUEE_SPEED
          )
        );
      }
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(container);
    observer.observe(measureEl);
    return () => observer.disconnect();
  }, [displayNoticeStr]);

  const openDetailModal = useCallback(() => {
    setDetailModalOpen(true);
  }, []);

  const handleContentKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetailModal();
      }
    },
    [openDetailModal]
  );

  const handleExpandKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetailModal();
      }
    },
    [openDetailModal]
  );

  if (!noticeStr) {
    return null;
  }

  const useMarquee = shouldMarquee && !prefersReducedMotion;

  return (
    <>
      <CompanyNoticeBannerStyleWrapper>
        <span className="notice-label">
          <NotificationFilled className="notice-label-icon" />
          <span>{t('dmsSystem.notification.title')}</span>
        </span>
        <div
          ref={contentAreaRef}
          className="notice-content-area"
          role="button"
          tabIndex={0}
          onClick={openDetailModal}
          onKeyDown={handleContentKeyDown}
        >
          <span ref={measureRef} className="notice-measure" aria-hidden="true">
            {displayNoticeStr}
          </span>
          {useMarquee ? (
            <div
              className="notice-marquee-track notice-marquee-animate"
              style={
                {
                  '--marquee-duration': `${marqueeDuration}s`
                } as React.CSSProperties
              }
            >
              <span className="notice-marquee-text">{displayNoticeStr}</span>
              <span
                className="notice-marquee-text duplicate"
                aria-hidden="true"
              >
                {displayNoticeStr}
              </span>
            </div>
          ) : (
            <>
              <span
                className={`notice-text${shouldMarquee ? ' is-ellipsis' : ''}`}
              >
                {displayNoticeStr}
              </span>
              {shouldMarquee && prefersReducedMotion && (
                <span
                  className="notice-expand-btn"
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    openDetailModal();
                  }}
                  onKeyDown={handleExpandKeyDown}
                >
                  {t('dmsSystem.notification.viewFullContent')}
                </span>
              )}
            </>
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
