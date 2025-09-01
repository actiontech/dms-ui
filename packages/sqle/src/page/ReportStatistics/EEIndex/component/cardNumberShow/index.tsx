import { useState } from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import CardShow from '../base/CardShow';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import {
  floatRound,
  minuteToHourMinute
} from '@actiontech/dms-kit/es/utils/Math';
import Icon from '@ant-design/icons/lib/components/Icon';
import { AxiosResponse } from 'axios';
import usePanelCommonRequest from '../../hooks/usePanelCommonRequest';
import { formatParamsBySeparator } from '@actiontech/dms-kit';
import {
  IGetWorkflowAuditPassPercentV1Return,
  IGetWorkflowCountV1Return,
  IGetWorkflowDurationOfWaitingForAuditV1Return
} from '@actiontech/shared/lib/api/sqle/service/statistic/index.d';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { formatTime } from '@actiontech/dms-kit/es/utils/Common';
import {
  TrendCardFilled,
  CheckDoubleSquareFilled,
  ClockCircleFilled
} from '@actiontech/icons';

const defaultVal = 0;

/**
 * todo: 与设计图相比数据不全
 *  noteCont相关数据暂时注释
 */
const CardNumberShow = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const [timeNow, setTimeNow] = useState<string | null>(null);

  const [totalOrder, setTotalOrder] = useState<number>(defaultVal); // 工单总数
  const [newOrder, setNewOrder] = useState<number>(defaultVal); // 今日新增

  const onSuccess = (res: AxiosResponse<IGetWorkflowCountV1Return>) => {
    setTotalOrder(res.data.data?.total ?? defaultVal);
    setNewOrder(res.data.data?.today_count ?? defaultVal);
    setTimeNow(formatTime(new Date()));
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getWorkflowCountV1(),
    { onSuccess }
  );

  const [time, setTime] = useState<string>('0'); // 平均审核时间

  const onSuccessTime = (
    res: AxiosResponse<IGetWorkflowDurationOfWaitingForAuditV1Return>
  ) => {
    setTime(minuteToHourMinute(res.data.data?.minutes || 0));
  };

  const { loading: timeLoading, errorMessage: timeError } =
    usePanelCommonRequest(
      () => statistic.getWorkflowDurationOfWaitingForAuditV1(),
      { onSuccess: onSuccessTime }
    );

  const [auditPass, setAuditPass] = useState<string>('0'); // 审核通过率

  const onSuccessAuditPass = (
    res: AxiosResponse<IGetWorkflowAuditPassPercentV1Return>
  ) => {
    setAuditPass(`${floatRound(res.data.data?.audit_pass_percent ?? 0)}%`);
  };

  const { loading: auditPassLoading, errorMessage: auditPassError } =
    usePanelCommonRequest(() => statistic.getWorkflowAuditPassPercentV1(), {
      onSuccess: onSuccessAuditPass
    });

  const renderCardIcon = (
    com: React.ComponentType<React.SVGProps<SVGSVGElement>>
  ) => {
    return (
      <Icon
        component={com}
        style={{
          color: sqleTheme.reportStatistics.cardShow.iconColor
        }}
      />
    );
  };

  return (
    <Row justify="center" align="top" gutter={20} className="card-box">
      <Col span={24} lg={12} xl={12} xxl={6}>
        <div className="item-wrapper card-wrapper marginTop20">
          <CardShow
            titleCont={t('reportStatistics.cardLine.title.orderTotal')}
            extraIcon={renderCardIcon(() => (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  opacity="0.5"
                  x="6"
                  y="10"
                  width="16"
                  height="12"
                  rx="1.5"
                  fill="currentColor"
                />
                <path
                  d="M2 4C2 2.89543 2.89543 2 4 2H17C18.1046 2 19 2.89543 19 4V22H4C2.89543 22 2 21.1046 2 20V4Z"
                  fill="currentColor"
                />
                <rect x="7" y="8" width="7" height="2" rx="0.5" fill="white" />
                <rect x="7" y="13" width="7" height="2" rx="0.5" fill="white" />
              </svg>
            ))}
            numberCont={
              loading || errorMessage
                ? defaultVal
                : formatParamsBySeparator(totalOrder)
            }
            noteCont={t('reportStatistics.cardLine.noteCont.deadline', {
              time: timeNow
            })}
          />
        </div>
      </Col>
      <Col span={24} lg={12} xl={12} xxl={6}>
        <div className="item-wrapper card-wrapper marginTop20">
          <CardShow
            titleCont={t('reportStatistics.cardLine.title.todayIncreased')}
            extraIcon={renderCardIcon(() => (
              <TrendCardFilled width={24} height={24} fill="currentColor" />
            ))}
            numberCont={
              loading || errorMessage
                ? defaultVal
                : formatParamsBySeparator(newOrder)
            }
            noteCont={t('reportStatistics.cardLine.noteCont.deadline', {
              time: timeNow
            })}
          />
        </div>
      </Col>
      <Col span={24} lg={12} xl={12} xxl={6}>
        <div className="item-wrapper card-wrapper marginTop20">
          <CardShow
            titleCont={t(
              'reportStatistics.cardLine.title.orderAverageAuditTime'
            )}
            extraIcon={renderCardIcon(() => (
              <ClockCircleFilled width={24} height={24} fill="currentColor" />
            ))}
            numberCont={timeLoading || timeError ? '0' : time}
            noteCont={
              <div className="note-wrapper">
                {/* <span>
                  {t(
                    'reportStatistics.cardLine.noteCont.orderAverageAuditTime.min'
                  )}
                  <span className="value">6h39min</span>
                </span>
                <span>
                  {t(
                    'reportStatistics.cardLine.noteCont.orderAverageAuditTime.max'
                  )}
                  <span className="value">24h53min</span>
                </span> */}
              </div>
            }
          />
        </div>
      </Col>
      <Col span={24} lg={12} xl={12} xxl={6}>
        <div className="item-wrapper card-wrapper marginTop20">
          <CardShow
            titleCont={t('reportStatistics.cardLine.title.auditPassRate')}
            extraIcon={renderCardIcon(() => (
              <CheckDoubleSquareFilled
                width={24}
                height={24}
                fill="currentColor"
              />
            ))}
            numberCont={auditPassLoading || auditPassError ? '0' : auditPass}
            noteCont={
              <div className="note-wrapper">
                {/* <span>
                  {t('reportStatistics.cardLine.noteCont.auditPassRate.passed')}
                  <span className="value">111</span>
                </span>
                <span>
                  {t(
                    'reportStatistics.cardLine.noteCont.auditPassRate.notPass'
                  )}
                  <span className="value">22</span>
                </span> */}
              </div>
            }
          />
        </div>
      </Col>
    </Row>
  );
};

export default CardNumberShow;
