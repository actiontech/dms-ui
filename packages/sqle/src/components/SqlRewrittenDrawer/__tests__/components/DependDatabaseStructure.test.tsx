import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../testUtils/customRender';
import { SqlRewrittenMockDataNoDDL } from '../../../../testUtils/mockApi/task/data';
import DependDatabaseStructure from '../../components/DependDatabaseStructure';
import { fireEvent, screen } from '@testing-library/dom';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('DependDatabaseStructure', () => {
  const mockDataSource = SqlRewrittenMockDataNoDDL.suggestions?.filter(
    (v) => v.type === RewriteSuggestionTypeEnum.structure
  )!;

  it('should render alert message with enable button', () => {
    const toggleEnableStructureOptimizeMock = jest.fn();

    superRender(
      <DependDatabaseStructure
        dataSource={mockDataSource}
        toggleEnableStructureOptimize={toggleEnableStructureOptimizeMock}
      />
    );

    expect(
      screen.getByText(
        '以下优化项涉及数据结构调整，为确保系统稳定运行，请按需手动开启：'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('启动数据库结构优化')).toBeInTheDocument();
  });

  it('should call toggleEnableStructureOptimize when enable button is clicked', () => {
    const toggleEnableStructureOptimizeMock = jest.fn();

    superRender(
      <DependDatabaseStructure
        dataSource={mockDataSource}
        toggleEnableStructureOptimize={toggleEnableStructureOptimizeMock}
      />
    );

    const enableButton = screen
      .getByText('启动数据库结构优化')
      .closest('button')!;
    fireEvent.click(enableButton);

    expect(toggleEnableStructureOptimizeMock).toHaveBeenCalled();
  });

  it('should render list items when dataSource has items', () => {
    superRender(
      <DependDatabaseStructure
        dataSource={mockDataSource}
        toggleEnableStructureOptimize={() => {}}
      />
    );

    expect(getAllBySelector('.ant-list-items')[0].childElementCount).toBe(
      mockDataSource.length
    );
  });

  it('should render empty content when dataSource is empty', () => {
    superRender(
      <DependDatabaseStructure
        dataSource={[]}
        toggleEnableStructureOptimize={() => {}}
      />
    );

    expect(screen.getByText('当前SQL无需待重写的规则')).toBeInTheDocument();
  });
});
