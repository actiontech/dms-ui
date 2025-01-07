import { CopyIcon, HighlightCode } from '@actiontech/shared';
import { SqlOptimizationCodeBlockStyleWrapper } from '../style';

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
