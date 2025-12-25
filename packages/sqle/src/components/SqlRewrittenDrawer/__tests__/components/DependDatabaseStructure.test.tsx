import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { SqlRewrittenMockDataNoDDL } from '@actiontech/shared/lib/testUtil/mockApi/sqle/task/data';
import DependDatabaseStructure from '../../components/DependDatabaseStructure';
import { fireEvent, screen } from '@testing-library/dom';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('DependDatabaseStructure', () => {
  const mockDataSource = SqlRewrittenMockDataNoDDL.suggestions?.filter(
    (v) => v.type === RewriteSuggestionTypeEnum.structure
  )!;

  it('should render alert message with enable button', () => {
    const toggleEnableStructureOptimizeActionMock = jest.fn();

    sqleSuperRender(
      <DependDatabaseStructure
        dataSource={mockDataSource}
        toggleEnableStructureOptimizeAction={
          toggleEnableStructureOptimizeActionMock
        }
      />
    );

    expect(
      screen.getByText(
        '以下优化项涉及数据结构调整，为确保系统稳定运行，请按需手动开启：'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('启动数据库结构优化')).toBeInTheDocument();
  });

  it('should call toggleEnableStructureOptimizeAction when enable button is clicked', () => {
    const toggleEnableStructureOptimizeActionMock = jest.fn();

    sqleSuperRender(
      <DependDatabaseStructure
        dataSource={mockDataSource}
        toggleEnableStructureOptimizeAction={
          toggleEnableStructureOptimizeActionMock
        }
      />
    );

    const enableButton = screen
      .getByText('启动数据库结构优化')
      .closest('button')!;
    fireEvent.click(enableButton);

    expect(toggleEnableStructureOptimizeActionMock).toHaveBeenCalled();
  });

  it('should render list items when dataSource has items', () => {
    sqleSuperRender(
      <DependDatabaseStructure
        dataSource={mockDataSource}
        toggleEnableStructureOptimizeAction={jest.fn()}
      />
    );

    expect(getAllBySelector('.ant-list-items')[0].childElementCount).toBe(
      mockDataSource.length
    );
  });

  it('should render empty content when dataSource is empty', () => {
    sqleSuperRender(
      <DependDatabaseStructure
        dataSource={[]}
        toggleEnableStructureOptimizeAction={jest.fn()}
      />
    );

    expect(screen.getByText('当前SQL无需待重写的规则')).toBeInTheDocument();
  });
});
