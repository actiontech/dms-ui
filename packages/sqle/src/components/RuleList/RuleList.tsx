import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyBox, BasicButton } from '@actiontech/shared';
import BasicToolTips, {
  tooltipsCommonProps
} from '@actiontech/shared/lib/components/BasicToolTips';
import { RuleListProps, RuleStatusEnum, EnumActionType } from './index.type';
import {
  EmptyRuleStyleWrapper,
  RuleItemStyleWrapper,
  RulesStyleWrapper
} from './style';
import { useTranslation } from 'react-i18next';
import { FloatButton, Space, Spin, Typography } from 'antd';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IconLevelError,
  IconLevelNotice,
  IconLevelNormal,
  IconLevelWarn
} from '@actiontech/shared/lib/Icon/LevelIcon';
import {
  IRuleParamResV1,
  IRuleResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { IconEdit } from '@actiontech/shared/lib/Icon/common';
import { IconDisabledRule, IconEnabledRule } from '../../icon/Rule';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import RuleDetailModal from './RuleDetailModal';
import { useBoolean } from 'ahooks';
import { isEqual } from 'lodash';

const scrollStepRange = 30;

const RuleList: React.FC<RuleListProps> = ({
  rules = [],
  pageHeaderHeight,
  isAction,
  actionType,
  renderDisableNode,
  onActionHandle,
  enableCheckDetail
}) => {
  const { t } = useTranslation();
  const isDisabled = useMemo(
    () => actionType === RuleStatusEnum.disabled,
    [actionType]
  );

  const renderLevelIcon = (level?: RuleResV1LevelEnum) => {
    const levelIcon = () => {
      if (level === RuleResV1LevelEnum.error) {
        return <IconLevelError />;
      } else if (level === RuleResV1LevelEnum.normal) {
        return <IconLevelNormal />;
      } else if (level === RuleResV1LevelEnum.notice) {
        return <IconLevelNotice />;
      } else if (level === RuleResV1LevelEnum.warn) {
        return <IconLevelWarn />;
      }
    };
    return (
      <div className="level-icon">
        {levelIcon()}
        <span className="level-icon-text">{level}</span>
      </div>
    );
  };

  const renderLevelContent = (rule: IRuleResV1) => {
    return (
      <div className="level-content">
        <Typography.Text className="level-content-desc">
          {rule.desc}
        </Typography.Text>
        <Typography.Paragraph
          ellipsis={{
            tooltip: {
              placement: 'topLeft',
              ...tooltipsCommonProps(rule.annotation, 640)
            }
          }}
          className="level-content-annotation"
        >
          {rule.annotation}
        </Typography.Paragraph>
        {renderParams(rule.params)}
      </div>
    );
  };

  const renderParams = (params?: IRuleParamResV1[]) => {
    if (!params) {
      return undefined;
    }
    return (
      <Space size={8} wrap className="level-content-params">
        {params?.map((v) => (
          <div className="level-content-params-item" key={v.key}>
            {v.desc} {': '}
            {v.value}
          </div>
        ))}
      </Space>
    );
  };

  const renderAction = (rule: IRuleResV1) => {
    return (
      <section className="action-wrapper">
        <Space size={10}>
          {actionType === RuleStatusEnum.enabled && (
            <BasicToolTips title={t('ruleTemplate.ruleTemplateForm.editRule')}>
              <BasicButton
                shape="circle"
                className="action-circle-btn edit-rule-item"
                key="edit-rule-btn"
                icon={<IconEdit className="icon-edit" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onActionHandle?.(rule, EnumActionType.edit);
                }}
              ></BasicButton>
            </BasicToolTips>
          )}
          {isDisabled ? (
            <BasicToolTips
              title={t('ruleTemplate.ruleTemplateForm.activeRule')}
            >
              <BasicButton
                shape="circle"
                className="action-circle-btn enabled-rule-item"
                key="enabled-rule-btn"
                icon={<IconEnabledRule className="icon-enabled" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onActionHandle?.(rule, EnumActionType.enabled);
                }}
              ></BasicButton>
            </BasicToolTips>
          ) : renderDisableNode ? (
            renderDisableNode(rule)
          ) : (
            <BasicToolTips
              title={t('ruleTemplate.ruleTemplateForm.disableRule')}
            >
              <BasicButton
                shape="circle"
                danger
                className="action-circle-btn disabled-rule-item"
                key="disabled-rule-btn"
                icon={<IconDisabledRule className="icon-disabled" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onActionHandle?.(rule, EnumActionType.disabled);
                }}
              ></BasicButton>
            </BasicToolTips>
          )}
        </Space>
      </section>
    );
  };

  const [scrollData, setScrollData] = useState<IRuleResV1[]>([]);
  const stepRef = useRef(0);
  const [currentRuleDetail, setCurrentRuleDetail] = useState<IRuleResV1>();
  const [visible, { setTrue: showRuleDetail, setFalse: hideRuleDetail }] =
    useBoolean();

  const onScroll = () => {
    setRulesRenderData();
  };

  const setRulesRenderData = () => {
    if (!rules.length) return;
    const step = stepRef.current;
    const scrollDataLength = scrollData.length;
    if (!step) {
      setScrollData(rules.slice(0, scrollStepRange));
      if (scrollStepRange < rules.length) {
        stepRef.current = step + 1;
      }
      return;
    }
    if (scrollDataLength === rules.length) {
      return;
    }
    // 处理 并不能完全 diff 的情况
    const renderDataLengthDiff =
      scrollDataLength !== (step - 1) * scrollStepRange + scrollStepRange;
    const data = renderDataLengthDiff
      ? rules.slice(0, step * scrollStepRange + scrollStepRange)
      : scrollData.concat(
          rules.slice(
            step * scrollStepRange,
            step * scrollStepRange + scrollStepRange
          )
        );
    setScrollData(data);
    if (data.length < rules.length) {
      stepRef.current = step + 1;
    }
  };

  const rulesRef = useRef<IRuleResV1[]>();

  useEffect(() => {
    // fix Warning: Maximum update depth exceeded
    if (!isEqual(rulesRef.current, rules)) {
      rulesRef.current = rules;
      stepRef.current = 0;
      setScrollData([]);
      onScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules]);

  const pageRemainingHeight = useMemo(() => {
    // #if [demo || ce]
    return pageHeaderHeight + 182;
    // #else
    return pageHeaderHeight + 127;
    // #endif
  }, [pageHeaderHeight]);

  return (
    <>
      <RulesStyleWrapper
        pageHeaderHeight={pageRemainingHeight}
        className="rule-list-wrapper"
        // #if [demo || ce]
        paddingBottomNone={true}
        // #endif
      >
        <EmptyBox
          if={rules.length > 0}
          defaultNode={
            <EmptyRuleStyleWrapper>
              <BasicEmpty emptyCont={t('common.tip.no_rule_data')} />
            </EmptyRuleStyleWrapper>
          }
        >
          <div id="rule-list-wrapper-id">
            <InfiniteScroll
              dataLength={scrollData.length}
              loader={<Spin spinning={true} />}
              next={onScroll}
              hasMore={scrollData.length < rules.length}
              endMessage={
                <section className="end-bottom-cont">
                  {t('common.tip.no_rule_data')}
                </section>
              }
              scrollableTarget="rule-list-wrapper-id"
            >
              {scrollData?.map((v) => {
                return (
                  <RuleItemStyleWrapper
                    key={v.rule_name}
                    style={{
                      cursor:
                        isAction || enableCheckDetail ? 'pointer' : 'default'
                    }}
                    className={classNames({
                      'has-top-margin': isAction
                    })}
                    onClick={() => {
                      if (enableCheckDetail) {
                        setCurrentRuleDetail(v);
                        showRuleDetail();
                      }
                    }}
                  >
                    {renderLevelIcon(v.level)}
                    {renderLevelContent(v)}
                    {isAction && renderAction(v)}
                  </RuleItemStyleWrapper>
                );
              })}
            </InfiniteScroll>
          </div>
        </EmptyBox>
      </RulesStyleWrapper>
      <FloatButton.BackTop
        target={() =>
          document.querySelector('#rule-list-wrapper-id') as HTMLElement
        }
      />
      <RuleDetailModal
        visible={visible}
        dataSource={currentRuleDetail}
        onClosed={hideRuleDetail}
      />
    </>
  );
};

export default RuleList;
