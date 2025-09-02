import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Descriptions, Statistic, Row, Col } from 'antd';
import { BasicButton, BasicModal, formatTime } from '@actiontech/shared';
import { useRequest } from 'ahooks';
import PlatformMetrics from '@actiontech/shared/lib/api/base/service/PlatformMetrics';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { initNavModalStatus } from '../../../../../../store/nav';
import { ModalName } from '../../../../../../data/ModalName';
import { IReduxState } from '../../../../../../store';
import { updateNavModalStatus } from '../../../../../../store/nav';
import { isNumber } from 'lodash';

const PlatformMetricsModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) => state.nav.modalStatus[ModalName.Platform_Metrics]
  );

  const { data, loading } = useRequest(
    () =>
      PlatformMetrics.GetPlatformMetrics().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      }),
    { ready: !!visible }
  );

  const handleCloseModal = useCallback(() => {
    dispatch(
      updateNavModalStatus({
        modalName: ModalName.Platform_Metrics,
        status: false
      })
    );
  }, [dispatch]);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return t('dmsMenu.platformMetrics.seconds', { seconds: 0 });
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let result = '';
    if (days > 0) result += t('dmsMenu.platformMetrics.days', { days: days });
    if (hours > 0)
      result += t('dmsMenu.platformMetrics.hours', { hours: hours });
    if (minutes > 0)
      result += t('dmsMenu.platformMetrics.minutes', { minutes: minutes });
    if (secs > 0 || result === '')
      result += t('dmsMenu.platformMetrics.seconds', { seconds: secs });

    return result.trim();
  };

  useEffect(() => {
    dispatch(
      initNavModalStatus({
        modalStatus: {
          [ModalName.Platform_Metrics]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <BasicModal
      width={800}
      title={t('dmsMenu.userNavigate.platformMetrics')}
      open={visible}
      onCancel={handleCloseModal}
      footer={[
        <BasicButton key="close" onClick={handleCloseModal}>
          {t('common.close')}
        </BasicButton>
      ]}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {data && (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Statistic
                  title={t('dmsMenu.platformMetrics.cpuUsage')}
                  value={data.cpu_usage}
                  precision={2}
                  suffix="%"
                  valueStyle={{
                    color:
                      data.cpu_usage && data.cpu_usage > 80
                        ? '#ff4d4f'
                        : '#3f8600'
                  }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={t('dmsMenu.platformMetrics.memoryUsagePercent')}
                  value={data.memory_usage_percent}
                  precision={2}
                  suffix="%"
                  valueStyle={{
                    color:
                      data.memory_usage_percent &&
                      data.memory_usage_percent > 80
                        ? '#ff4d4f'
                        : '#3f8600'
                  }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={t('dmsMenu.platformMetrics.goroutineCount')}
                  value={data.goroutine_count}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>

            <Descriptions column={2} bordered>
              <Descriptions.Item label={t('dmsMenu.platformMetrics.processId')}>
                {data.process_id || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('dmsMenu.platformMetrics.uptime')}>
                {formatUptime(data.uptime)}
              </Descriptions.Item>
              <Descriptions.Item
                label={t('dmsMenu.platformMetrics.memoryUsage')}
              >
                {formatBytes(data.memory_usage)}
              </Descriptions.Item>
              <Descriptions.Item
                label={t('dmsMenu.platformMetrics.totalMemory')}
              >
                {formatBytes(data.total_memory)}
              </Descriptions.Item>
              <Descriptions.Item
                label={t('dmsMenu.platformMetrics.timestamp')}
                span={2}
              >
                {isNumber(data.timestamp)
                  ? formatTime(new Date(data.timestamp * 1000).toLocaleString())
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Spin>
    </BasicModal>
  );
};

export default PlatformMetricsModal;
