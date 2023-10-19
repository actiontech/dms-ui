import { floatRound } from '@actiontech/shared/lib/utils/Math';
import { ColumnProgressStyleWrapper } from './style';

interface IColumnProgress {
  barWidth: number;
}

const ColumnProgress = (props: IColumnProgress) => {
  const { barWidth } = props;

  const comWidth = `${
    barWidth < 0 ? 0 : barWidth > 100 ? 100 : floatRound(barWidth)
  }%`;

  return (
    <ColumnProgressStyleWrapper>
      <div className="progress-line">
        <div className="progress-bar" style={{ width: comWidth }}></div>
      </div>
      <div className="progress-text">{comWidth}</div>
    </ColumnProgressStyleWrapper>
  );
};

export default ColumnProgress;
