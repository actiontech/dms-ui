import { screen, fireEvent } from '@testing-library/react';
import { ObjectDiffResultComparisonResultEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import ComparisonOverview from '../component/ComparisonOverview';
import { comparisonOverviewDict } from '../component/ComparisonOverview/index.data';
import { executeDatabaseComparisonMockData } from '../../../../testUtils/mockApi/database_comparison/data';
import { superRender } from '../../../../testUtils/customRender';

describe('ComparisonOverview', () => {
  const mockOnCardClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should superRender all comparison result cards', () => {
    const { container } = superRender(
      <ComparisonOverview
        comparisonResults={executeDatabaseComparisonMockData}
        onCardClick={mockOnCardClick}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should call onCardClick with correct type when card is clicked', () => {
    superRender(
      <ComparisonOverview
        comparisonResults={executeDatabaseComparisonMockData}
        onCardClick={mockOnCardClick}
      />
    );

    const sameCard = screen
      .getByText(
        comparisonOverviewDict[ObjectDiffResultComparisonResultEnum.same].title
      )
      .closest('div');
    fireEvent.click(sameCard!);

    expect(mockOnCardClick).toHaveBeenCalledWith(
      ObjectDiffResultComparisonResultEnum.same
    );
  });

  it('should apply selected class when card is selected', () => {
    superRender(
      <ComparisonOverview
        comparisonResults={executeDatabaseComparisonMockData}
        onCardClick={mockOnCardClick}
        selectedType={ObjectDiffResultComparisonResultEnum.same}
      />
    );

    const selectedCard = screen
      .getByText(
        comparisonOverviewDict[ObjectDiffResultComparisonResultEnum.same].title
      )
      .parentElement?.parentElement?.closest('div');
    expect(selectedCard).toHaveClass('selected');
  });

  it('should handle empty comparison results', () => {
    superRender(
      <ComparisonOverview
        comparisonResults={[]}
        onCardClick={mockOnCardClick}
      />
    );

    expect(screen.getAllByText('0')).toHaveLength(
      Object.keys(comparisonOverviewDict).length
    );
  });

  it('should handle undefined comparison results', () => {
    superRender(<ComparisonOverview onCardClick={mockOnCardClick} />);

    expect(screen.getAllByText('0')).toHaveLength(
      Object.keys(comparisonOverviewDict).length
    );
  });
});
