import { renderHook, render, screen } from '@testing-library/react';
import { Form } from 'antd';
import SqlUploadFileCont from '../components/SqlUploadCont';
import { FormSubmitStatusContext } from '../..';
import { UploadTypeEnum } from '../../SQLInfoForm/index.type';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('SqlUploadCont accept attributes and tips', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  const renderWithUploadType = (uploadType: UploadTypeEnum) => {
    const { result } = renderHook(() => Form.useForm());
    const form = result.current[0];
    form.setFieldsValue({ uploadType });
    return render(
      <FormSubmitStatusContext.Provider value={false}>
        <Form form={form}>
          <SqlUploadFileCont form={form} />
        </Form>
      </FormSubmitStatusContext.Provider>
    );
  };

  const acceptTestCases = [
    {
      name: 'SQL file upload accept should include .sql, .txt, .java',
      uploadType: UploadTypeEnum.sqlFile,
      expectedAccept: '.sql,.txt,.java'
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

  it('should display correct SQL file tips text', () => {
    renderWithUploadType(UploadTypeEnum.sqlFile);
    expect(
      screen.getByText(
        /支持 \.sql, \.txt, \.java 格式/
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

  it('should not render file inputs when upload type is sql', () => {
    const { container } = renderWithUploadType(UploadTypeEnum.sql);
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeNull();
  });
});
