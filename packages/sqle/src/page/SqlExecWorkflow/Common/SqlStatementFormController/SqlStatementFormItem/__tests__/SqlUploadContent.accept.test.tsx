import { renderHook, render, screen } from '@testing-library/react';
import { Form } from 'antd';
import SqlUploadContent from '../components/SqlUploadContent';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('SqlUploadContent accept attributes and tips', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  const renderWithUploadType = (
    uploadType: AuditTaskResV1SqlSourceEnum
  ) => {
    const { result } = renderHook(() => Form.useForm());
    return render(
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
      name: 'SQL file upload accept should include .sql, .txt, .java',
      uploadType: AuditTaskResV1SqlSourceEnum.sql_file,
      expectedAccept: '.sql,.txt,.java'
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

  it('should display correct SQL file tips text', () => {
    renderWithUploadType(AuditTaskResV1SqlSourceEnum.sql_file);
    expect(
      screen.getByText(
        /支持 \.sql, \.txt, \.java 格式/
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

  it('should not render file inputs when upload type is form_data', () => {
    const { container } = renderWithUploadType(
      AuditTaskResV1SqlSourceEnum.form_data
    );
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeNull();
  });
});
