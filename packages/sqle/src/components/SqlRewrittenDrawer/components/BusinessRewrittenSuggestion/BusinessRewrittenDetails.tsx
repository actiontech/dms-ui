import { BasicTypographyEllipsis, LazyLoadComponent } from '@actiontech/shared';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { useToggle } from 'ahooks';
import rehypeSanitize from 'rehype-sanitize';
import RuleLevelIcon from '../../../RuleList/RuleLevelIcon';
import {
  OptimizationRuleItemStyleWrapper,
  RewrittenSuggestionDetailsStyleWrapper,
  OptimizationDescriptionStyleWrapper,
  MarkdownPreviewModeStyleWrapper
} from '../Common/style';

type Props = IRewriteSuggestion;

const BusinessRewrittenDetails: React.FC<Props> = ({
  audit_level,
  rule_name,
  desc
}) => {
  const [showDetails, { toggle: toggleShowDetails }] = useToggle();

  return (
    <>
      <OptimizationRuleItemStyleWrapper
        onClick={toggleShowDetails}
        isActive={showDetails}
      >
        <RuleLevelIcon ruleLevel={audit_level} onlyShowIcon iconFontSize={18} />
        <BasicTypographyEllipsis
          className="rule-name"
          copyable={false}
          textCont={rule_name ?? ''}
        />
      </OptimizationRuleItemStyleWrapper>
      <LazyLoadComponent open={showDetails} animation={false}>
        <RewrittenSuggestionDetailsStyleWrapper>
          <OptimizationDescriptionStyleWrapper>
            <MarkdownPreviewModeStyleWrapper
              className="description-content"
              source={desc}
              rehypePlugins={[rehypeSanitize]}
            />
          </OptimizationDescriptionStyleWrapper>
        </RewrittenSuggestionDetailsStyleWrapper>
      </LazyLoadComponent>
    </>
  );
};

export default BusinessRewrittenDetails;
