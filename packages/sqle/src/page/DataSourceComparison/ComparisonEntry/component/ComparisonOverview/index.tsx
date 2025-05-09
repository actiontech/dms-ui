import { Row, Col, Typography } from 'antd';
import { ObjectDiffResultComparisonResultEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
import { useMemo } from 'react';
import { OverviewContainer, OverviewCardStyleWrapper } from './style';
import { comparisonOverviewDict } from './index.data';
import classNames from 'classnames';

type Props = {
  comparisonResults?: ISchemaObject[];
  onCardClick: (type: ObjectDiffResultComparisonResultEnum) => void;
  selectedType?: ObjectDiffResultComparisonResultEnum;
};

const ComparisonOverview: React.FC<Props> = ({
  comparisonResults,
  onCardClick,
  selectedType
}) => {
  const comparisonResultCount = useMemo<
    Record<ObjectDiffResultComparisonResultEnum, number>
  >(() => {
    const result: Record<ObjectDiffResultComparisonResultEnum, number> = {
      [ObjectDiffResultComparisonResultEnum.base_not_exist]: 0,
      [ObjectDiffResultComparisonResultEnum.comparison_not_exist]: 0,
      [ObjectDiffResultComparisonResultEnum.inconsistent]: 0,
      [ObjectDiffResultComparisonResultEnum.same]: 0
    };

    comparisonResults?.forEach((schema) => {
      schema.database_diff_objects?.forEach((dbObject) => {
        dbObject.objects_diff_result?.forEach((diffResult) => {
          if (diffResult.comparison_result) {
            result[diffResult.comparison_result]++;
          }
        });
      });
    });

    return result;
  }, [comparisonResults]);

  return (
    <OverviewContainer>
      <Row gutter={16}>
        {Object.entries(comparisonOverviewDict).map(([key, meta]) => (
          <Col span={6} key={key}>
            <OverviewCardStyleWrapper
              onClick={() =>
                onCardClick(key as ObjectDiffResultComparisonResultEnum)
              }
              className={classNames({
                'card-same-mode':
                  key === ObjectDiffResultComparisonResultEnum.same,
                'card-inconsistent-mode':
                  key === ObjectDiffResultComparisonResultEnum.inconsistent,
                'card-base-not-exist-mode':
                  key === ObjectDiffResultComparisonResultEnum.base_not_exist,
                'card-comparison-not-exist-mode':
                  key ===
                  ObjectDiffResultComparisonResultEnum.comparison_not_exist,
                selected: key === selectedType
              })}
            >
              <Typography.Title className="card-title" level={4}>
                {meta.title}
              </Typography.Title>
              <div className="stat-number">
                {
                  comparisonResultCount[
                    key as ObjectDiffResultComparisonResultEnum
                  ]
                }
              </div>
              <div className="card-footer">
                <Typography.Text className="suggestion">
                  {meta.suggestion}
                </Typography.Text>
              </div>
            </OverviewCardStyleWrapper>
          </Col>
        ))}
      </Row>
    </OverviewContainer>
  );
};

export default ComparisonOverview;
