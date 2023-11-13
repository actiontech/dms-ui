import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import ChartWrapper from '../../../../../components/ChartCom/ChartWrapper';
import CardWrapper from '../../../../../components/CardWrapper';

// import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import ChartContTitle from '../../../../../page/ReportStatistics/EEIndex/component/base/ChartContTitle';

import { Gauge, GaugeConfig } from '@ant-design/plots';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import useThemeStyleData from '../../../../..//hooks/useThemeStyleData';
import useChatsDataByAPI from '../../hooks/useChatsDataByAPI';
import { floatRound } from '@actiontech/shared/lib/utils/Math';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { useChangeTheme } from '@actiontech/shared/lib/hooks';

enum EnumLevel {
  dangerous = 'dangerous',
  warning = 'warning',
  good = 'good',
  excellent = 'excellent'
}

type typeLevel =
  | EnumLevel.dangerous
  | EnumLevel.warning
  | EnumLevel.good
  | EnumLevel.excellent;

/**
  todo：
    - 自定义指针
 */
const ProjectScore = () => {
  const { t } = useTranslation();
  const { currentTheme } = useChangeTheme();

  const { projectName } = useCurrentProject();
  const [data, setData] = useState<number>();
  const { loading, errorMessage, getApiData } = useChatsDataByAPI(
    () => statistic.GetProjectScoreV1({ project_name: projectName }),
    {
      onSuccess: (res) => {
        setData(res.data.data?.score ?? 0);
      }
    }
  );

  const { sqleTheme } = useThemeStyleData();

  const levelData: {
    [key in typeLevel]: {
      color: string;
      text: string;
    };
  } = useMemo(() => {
    return {
      dangerous: {
        color: sqleTheme.projectOverview.ProjectScore.level.dangerous,
        text: t('projectManage.projectOverview.projectScore.level.dangerous')
      },
      warning: {
        color: sqleTheme.projectOverview.ProjectScore.level.warning,
        text: t('projectManage.projectOverview.projectScore.level.warning')
      },
      good: {
        color: sqleTheme.projectOverview.ProjectScore.level.good,
        text: t('projectManage.projectOverview.projectScore.level.good')
      },
      excellent: {
        color: sqleTheme.projectOverview.ProjectScore.level.excellent,
        text: t('projectManage.projectOverview.projectScore.level.excellent')
      }
    };
  }, [t, sqleTheme]);

  const currentLevel = useMemo(() => {
    let level = EnumLevel.good;
    const currentRate = Number(data);
    if (currentRate < 40) {
      level = EnumLevel.dangerous;
    } else if (currentRate >= 40 && currentRate < 60) {
      level = EnumLevel.warning;
    } else if (currentRate >= 60 && currentRate < 80) {
      level = EnumLevel.good;
    } else {
      level = EnumLevel.excellent;
    }
    return {
      text: levelData[level].text,
      color: levelData[level].color
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, levelData, sqleTheme]);

  const config: GaugeConfig = useMemo(
    () => ({
      percent: data ? floatRound(data / 100) : 0,
      range: {
        color: currentLevel.color,
        width: 20
      },
      autoFit: true,
      appendPadding: [10, 0, 40, 0],
      radius: 0.9,
      innerRadius: 0.8,
      startAngle: 15,
      endAngle: 0.7,
      indicator: {
        pointer: {
          // 指针：只允许静态的 object
          style: {
            stroke: sqleTheme.projectOverview.ProjectScore.indicator.pointer,
            lineWidth: 3
          }
        },
        pin: {
          // 圆环：只允许静态的 object
          style: {
            r: 6,
            fill: sqleTheme.projectOverview.ProjectScore.indicator.pin.fill,
            lineWidth: 3,
            stroke: sqleTheme.projectOverview.ProjectScore.indicator.pin.stroke
          }
        }
        // shape: 'triangle-gauge-indicator' // 自定义，需实现一下指针
      },
      axis: false,
      statistic: {
        content: {
          offsetY: 20,
          style: {
            height: '28px',
            lineHeight: 28,
            fontWeight: 300,
            fontSize: '13px',
            color: currentLevel.color,
            background: `${currentLevel.color}10`,
            borderRadius: '100px',
            padding: '0 16px'
          },
          formatter: () => currentLevel.text
        }
      }
    }),
    [currentLevel, data, sqleTheme]
  );

  return (
    <CardWrapper title={t('projectManage.projectOverview.projectScore.title')}>
      <ChartWrapper
        loading={loading}
        errorInfo={errorMessage}
        dataLength={typeof data === 'number' ? 1 : 0}
        emptyCont={t('common.tip.no_data')}
        onRefresh={() => {
          getApiData();
        }}
      >
        <ChartContTitle
          mainText={data}
          noteText={t('projectManage.projectOverview.projectScore.newScore')}
        />
        <section style={{ height: 200 }}>
          <Gauge {...config} theme={currentTheme} />
        </section>
      </ChartWrapper>
    </CardWrapper>
  );
};

export default ProjectScore;
