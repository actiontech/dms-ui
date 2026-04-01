import { renderHook, screen } from '@testing-library/react';
import { Form } from 'antd';
import SqlUploadContent from '../components/SqlUploadContent';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

describe('SqlUploadContent accept attributes and tips', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  const renderWithUploadType = (
    uploadType: AuditTaskResV1SqlSourceEnum
  ) => {
    const { result } = renderHook(() => Form.useForm());
    return sqleSuperRender(
      <Form form={result.current[0]}>
        <SqlUploadContent
          currentSqlUploadType={uploadType}
          fieldPrefixPath="1"
          dbSourceInfoCollection={{ value: {}, set: jest.fn() }}
        />
      </Form>
    );
  };

  const acceptTestCases = [
    {
      name: 'SQL file upload accept should include .sql, .txt, .java, .xlsx',
      uploadType: AuditTaskResV1SqlSourceEnum.sql_file,
      expectedAccept: '.sql,.txt,.java,.xlsx'
    },
    {
      name: 'ZIP file upload accept should include .zip, .rar, .7z',
      uploadType: AuditTaskResV1SqlSourceEnum.zip_file,
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
    renderWithUploadType(AuditTaskResV1SqlSourceEnum.sql_file);
    expect(
      screen.getByText(
        /支持 \.sql, \.txt, \.java, \.xlsx 格式/
      )
    ).toBeInTheDocument();
  });

  it('should display correct ZIP file tips text', () => {
    renderWithUploadType(AuditTaskResV1SqlSourceEnum.zip_file);
    expect(
      screen.getByText(
        /支持 \.zip, \.rar, \.7z 格式/
      )
    ).toBeInTheDocument();
  });

  it('should render XLSX template tips text when upload type is sql_file', () => {
    renderWithUploadType(AuditTaskResV1SqlSourceEnum.sql_file);
    expect(
      screen.getByText(/请使用标准模板格式/)
    ).toBeInTheDocument();
  });

  it('should render XLSX template download link when upload type is sql_file', () => {
    const { container } = renderWithUploadType(
      AuditTaskResV1SqlSourceEnum.sql_file
    );
    const downloadLink = container.querySelector(
      'a[href="/static/xlsx_template.xlsx"]'
    );
    expect(downloadLink).not.toBeNull();
    expect(downloadLink?.textContent).toContain('下载模板');
    expect(downloadLink?.getAttribute('download')).toBe('xlsx_template.xlsx');
  });

  it('should not render file inputs when no file-based upload type is active', () => {
    // Render without specifying an upload type (defaults to undefined),
    // so no LazyLoadComponent opens and no file inputs should appear.
    // Avoids rendering form_data type which triggers CustomMonacoEditor
    // and its Redux dependencies outside the scope of this test.
    const { result } = renderHook(() => Form.useForm());
    const { container } = sqleSuperRender(
      <Form form={result.current[0]}>
        <SqlUploadContent
          currentSqlUploadType={undefined as unknown as AuditTaskResV1SqlSourceEnum}
          fieldPrefixPath="1"
          dbSourceInfoCollection={{ value: {}, set: jest.fn() }}
        />
      </Form>
    );
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeNull();
  });
});
