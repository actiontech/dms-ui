import { Empty, Typography, Spin } from 'antd';
import { RuleUnderstandProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { EmptyBox } from '@actiontech/shared';
import EditKnowledgeContent from './EditKnowledgeContent';
import rehypeSanitize from 'rehype-sanitize';
import {
  RuleKnowledgeMarkDownStyleWrapper,
  RuleKnowledgeDocumentStyleWrapper
} from '../style';
import MarkdownTOC from '../components/MarkdownTOC';
import classNames from 'classnames';
import { useRef } from 'react';
import { useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import Graph from '../../Knowledge/Graph';
import { markdownPreviewOptions } from '../Common/MarkdownPreview/markdownPreviewOptions';

const RuleUnderstand: React.FC<RuleUnderstandProps> = ({
  content,
  loading,
  isModifying,
  editValue,
  setEditValue,
  setHasDirtyData,
  ruleName
}) => {
  const { t } = useTranslation();
  const markdownRef = useRef<HTMLDivElement>(null);

  const { data: graphData, loading: getGraphLoading } = useRequest(() =>
    SqleApi.KnowledgeBaseService.getKnowledgeGraph({
      filter_by_rule_name: ruleName
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return {
          edges: res.data.data?.edges ?? [],
          nodes: res.data.data?.nodes ?? []
        };
      }
    })
  );

  return (
    <RuleKnowledgeDocumentStyleWrapper
      className={classNames({ 'card-editing-status': isModifying })}
    >
      <Spin spinning={loading || getGraphLoading}>
        {isModifying ? (
          <EditKnowledgeContent
            value={editValue}
            onChange={setEditValue}
            setHasDirtyData={setHasDirtyData}
          />
        ) : (
          <EmptyBox
            if={!!content}
            defaultNode={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Typography.Text type="secondary">
                    {t('ruleKnowledge.noData')}
                  </Typography.Text>
                }
              />
            }
          >
            <div ref={markdownRef} className="markdown-container">
              <RuleKnowledgeMarkDownStyleWrapper
                source={content}
                rehypePlugins={[rehypeSanitize]}
                components={markdownPreviewOptions?.components}
              />
              <EmptyBox
                if={!!graphData?.nodes.length && !!graphData?.edges.length}
              >
                <Typography.Title className="graph-title" level={2}>
                  {t('ruleKnowledge.knowledgeGraph')}
                </Typography.Title>
                <Graph graphData={graphData} />
              </EmptyBox>
            </div>
            <MarkdownTOC
              markdownLoaded={!loading && !getGraphLoading}
              containerRef={markdownRef}
            />
          </EmptyBox>
        )}
      </Spin>
    </RuleKnowledgeDocumentStyleWrapper>
  );
};

export default RuleUnderstand;
