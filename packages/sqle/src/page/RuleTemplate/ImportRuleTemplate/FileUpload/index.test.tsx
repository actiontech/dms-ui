import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import FileUpload from '.';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { useForm } from 'antd/es/form/Form';
import { Form, UploadProps } from 'antd';
import { FileUploadCheckStatusType } from '../../../../hooks/useRuleTemplateForm/index.type';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import { mockUseDatabaseType } from '../../../../testUtils/mockHooks/data';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';

describe('test FileUpload', () => {
  const customRender = (
    props: UploadProps & {
      uploadCheckStatus: FileUploadCheckStatusType;
    }
  ) => {
    const { result } = renderHook(() => useForm());
    return sqleSuperRender(
      <Form form={result.current[0]}>
        <Form.Item name="fileType" initialValue="csv">
          <input />
        </Form.Item>
        <FileUpload {...props} />
      </Form>
    );
  };
  let getRuleTemplateFileSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getRuleTemplateFileSpy = rule_template.getRuleTemplateFile();
    mockDatabaseType({ dbTypeOptions: [{ label: 'MySQL', value: 'MySQL' }] });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should display a success message when uploadCheckStatus.success is truthy', () => {
    const { baseElement } = customRender({
      uploadCheckStatus: { success: true }
    });

    expect(baseElement).toMatchSnapshot();
  });

  it('should display an error message when uploadCheckStatus.errorMessage is present', () => {
    const { baseElement } = customRender({
      uploadCheckStatus: { success: false, errorMessage: 'error message' }
    });

    expect(baseElement).toMatchSnapshot();
  });

  it('should render the DownloadTemplateModal component when downloadTemplateModalVisibility is true', async () => {
    const { baseElement } = customRender({
      uploadCheckStatus: { success: false, errorMessage: 'error message' }
    });

    fireEvent.click(screen.getByText('下载导入模板'));

    expect(mockUseDatabaseType.updateDriverNameList).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();

    selectOptionByIndex('数据源类型', 'MySQL');

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('下 载'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getRuleTemplateFileSpy).toHaveBeenCalledTimes(1);
    expect(getRuleTemplateFileSpy).toHaveBeenCalledWith(
      { instance_type: 'MySQL', file_type: 'csv' },
      { responseType: 'blob' }
    );
    expect(screen.getByText('正在下载模板文件...')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('正在下载模板文件...')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
