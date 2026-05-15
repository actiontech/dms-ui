import { fireEvent, screen } from '@testing-library/react';
import ExportFormatModal from '../index';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { GetAuditPlanSQLExportReqV1ExportFormatEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('ExportFormatModal', () => {
  const mockOnFormatChange = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    open: true,
    selectedFormat: GetAuditPlanSQLExportReqV1ExportFormatEnum.csv,
    onFormatChange: mockOnFormatChange,
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal with correct title and options', () => {
    const { baseElement } = sqleSuperRender(
      <ExportFormatModal {...defaultProps} />
    );

    expect(screen.getByText('选择导出文件格式')).toBeInTheDocument();
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('Excel')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should not render modal when open is false', () => {
    sqleSuperRender(<ExportFormatModal {...defaultProps} open={false} />);

    expect(screen.queryByText('选择导出文件格式')).not.toBeInTheDocument();
  });

  it('should call onFormatChange when format is changed', () => {
    sqleSuperRender(<ExportFormatModal {...defaultProps} />);

    const excelRadio = screen.getByText('Excel');
    fireEvent.click(excelRadio);

    expect(mockOnFormatChange).toHaveBeenCalledWith('excel');
  });

  it('should call onConfirm when confirm button is clicked', () => {
    sqleSuperRender(<ExportFormatModal {...defaultProps} />);

    const confirmButton = screen.getByText('确 认');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    sqleSuperRender(<ExportFormatModal {...defaultProps} />);

    const cancelButton = screen.getByText('取 消');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
