import { ObjectDiffResultComparisonResultEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import ComparisonOverview from '../component/ComparisonOverview';
import { getComparisonOverviewDict } from '../component/ComparisonOverview/index.data';
import { executeDatabaseComparisonMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/database_comparison/data';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { screen, fireEvent } from '@testing-library/react';

describe('ComparisonOverview', () => {
  const mockOnCardClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should superRender all comparison result cards', () => {
    const { container } = sqleSuperRender(
      <ComparisonOverview
        comparisonResults={executeDatabaseComparisonMockData}
        onCardClick={mockOnCardClick}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should call onCardClick with correct type when card is clicked', () => {
    sqleSuperRender(
      <ComparisonOverview
        comparisonResults={executeDatabaseComparisonMockData}
        onCardClick={mockOnCardClick}
      />
    );

    const sameCard = screen
      .getByText(
        getComparisonOverviewDict()[ObjectDiffResultComparisonResultEnum.same]
          .title
      )
      .closest('div');
    fireEvent.click(sameCard!);

    expect(mockOnCardClick).toHaveBeenCalledWith(
      ObjectDiffResultComparisonResultEnum.same
    );
  });

  it('should apply selected class when card is selected', () => {
    sqleSuperRender(
      <ComparisonOverview
        comparisonResults={executeDatabaseComparisonMockData}
        onCardClick={mockOnCardClick}
        selectedType={ObjectDiffResultComparisonResultEnum.same}
      />
    );

    const selectedCard = screen
      .getByText(
        getComparisonOverviewDict()[ObjectDiffResultComparisonResultEnum.same]
          .title
      )
      .parentElement?.parentElement?.closest('div');
    expect(selectedCard).toHaveClass('selected');
  });

  it('should handle empty comparison results', () => {
    sqleSuperRender(
      <ComparisonOverview
        comparisonResults={[]}
        onCardClick={mockOnCardClick}
      />
    );

    expect(screen.getAllByText('0')).toHaveLength(
      Object.keys(getComparisonOverviewDict()).length
    );
  });

  it('should handle undefined comparison results', () => {
    sqleSuperRender(<ComparisonOverview onCardClick={mockOnCardClick} />);

    expect(screen.getAllByText('0')).toHaveLength(
      Object.keys(getComparisonOverviewDict()).length
    );
  });
});
