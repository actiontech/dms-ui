import type {
  CustomGraphQLClient,
  UploadProgressEvent
} from '../CustomGraphQLClient';
import { GlobalConstants } from '../utils/GlobalConstants';

export interface IUploadBlobResultSetExtension {
  uploadBlobResultSet: (
    fileId: string,
    data: Blob,
    onUploadProgress?: (event: UploadProgressEvent) => void
  ) => Promise<void>;
}

export function uploadBlobResultSetExtension(
  client: CustomGraphQLClient
): IUploadBlobResultSetExtension {
  return {
    uploadBlobResultSet(
      fileId: string,
      data: Blob,
      onUploadProgress?: (event: UploadProgressEvent) => void
    ): Promise<void> {
      // api/resultset/blob
      return client.uploadFile(
        GlobalConstants.absoluteServiceUrl('resultset', 'blob'),
        data,
        undefined,
        { fileId },
        onUploadProgress
      );
    }
  };
}
