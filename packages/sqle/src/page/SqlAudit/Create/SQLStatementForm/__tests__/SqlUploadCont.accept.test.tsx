import { screen } from '@testing-library/react';
import { Form } from 'antd';
import SqlUploadFileCont from '../components/SqlUploadCont';
import { FormSubmitStatusContext } from '../..';
import { UploadTypeEnum } from '../../SQLInfoForm/index.type';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { sqleSuperRender } from '../../../../../testUtils/superRender';

describe('SqlUploadCont accept attributes and tips', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  /**
   * Wrapper component that creates the form instance internally
   * and includes a hidden Form.Item for uploadType so that
   * Form.useWatch('uploadType', form) works correctly.
   */
  const TestWrapper = ({ uploadType }: { uploadType: UploadTypeEnum }) => {
    const [form] = Form.useForm();

    return (
      <FormSubmitStatusContext.Provider value={false}>
        <Form form={form} initialValues={{ uploadType }}>
          <Form.Item name="uploadType" noStyle>
            <input type="hidden" />
          </Form.Item>
          <SqlUploadFileCont form={form} />
        </Form>
      </FormSubmitStatusContext.Provider>
    );
  };

  const renderWithUploadType = (uploadType: UploadTypeEnum) => {
    return sqleSuperRender(<TestWrapper uploadType={uploadType} />);
  };

  const acceptTestCases = [
    {
      name: 'SQL file upload accept should include .sql, .txt, .java, .xlsx',
      uploadType: UploadTypeEnum.sqlFile,
      expectedAccept: '.sql,.txt,.java,.xlsx'
    },
    {
      name: 'ZIP file upload accept should include .zip, .rar, .7z',
      uploadType: UploadTypeEnum.zipFile,
      expectedAccept: '.zip,.rar,.7z'
    }
  ];

  it.each(acceptTestCases)(
    '$name',
    ({ uploadType, expectedAccept }) => {
      const { container } = renderWithUploadType(uploadType);
      const fileInput = container.querySelector(
        `input[type="file"][accept="${expectedAccept}"]`
      );
      expect(fileInput).not.toBeNull();
    }
  );

  it('should display correct SQL file tips text including .xlsx', () => {
    renderWithUploadType(UploadTypeEnum.sqlFile);
    expect(
      screen.getByText(
        /支持 \.sql, \.txt, \.java, \.xlsx 格式/
      )
    ).toBeInTheDocument();
  });

  it('should display correct ZIP file tips text', () => {
    renderWithUploadType(UploadTypeEnum.zipFile);
    expect(
      screen.getByText(
        /支持 \.zip, \.rar, \.7z 格式/
      )
    ).toBeInTheDocument();
  });

  it('should render XLSX template tips text when upload type is sqlFile', () => {
    renderWithUploadType(UploadTypeEnum.sqlFile);
    expect(
      screen.getByText(/请使用标准模板格式/)
    ).toBeInTheDocument();
  });

  it('should render XLSX template download link when upload type is sqlFile', () => {
    const { container } = renderWithUploadType(UploadTypeEnum.sqlFile);
    const downloadLink = container.querySelector(
      'a[href="/static/xlsx_template.xlsx"]'
    );
    expect(downloadLink).not.toBeNull();
    expect(downloadLink?.textContent).toContain('下载模板');
    expect(downloadLink?.getAttribute('download')).toBe('xlsx_template.xlsx');
  });

  it('should not render file inputs when uploadType is not a file-based type', () => {
    // When uploadType is not registered as a Form.Item (simulating
    // a non-file upload type), Form.useWatch returns undefined,
    // so no EmptyBox conditions match and no file inputs render.
    const NoFileWrapper = () => {
      const [form] = Form.useForm();
      return (
        <FormSubmitStatusContext.Provider value={false}>
          <Form form={form}>
            <SqlUploadFileCont form={form} />
          </Form>
        </FormSubmitStatusContext.Provider>
      );
    };
    const { container } = sqleSuperRender(<NoFileWrapper />);
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeNull();
  });
});
