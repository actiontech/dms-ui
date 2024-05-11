import { HighlightCode } from '@actiontech/shared';
import { SqlOptimizationCodeBlockStyleWrapper } from '../style';
import CopyIcon from '@actiontech/shared/lib/components/CopyIcon';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  return (
    <SqlOptimizationCodeBlockStyleWrapper>
      <span className="copy-icon">
        <CopyIcon text={code} />
      </span>
      <pre
        className="code-wrapper"
        dangerouslySetInnerHTML={{
          __html: HighlightCode.highlightSql(code)
        }}
      />
    </SqlOptimizationCodeBlockStyleWrapper>
  );
};

export default CodeBlock;
