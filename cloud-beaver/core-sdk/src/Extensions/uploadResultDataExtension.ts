import type {
  CustomGraphQLClient,
  UploadProgressEvent
} from '../CustomGraphQLClient';
import type { AsyncTaskInfo } from '../sdk';
import { GlobalConstants } from '../utils/GlobalConstants';

export interface IUploadResultDataExtension {
  uploadResultData: (
    connectionId: string,
    contextId: string,
    projectId: string,
    resultsId: string,
    processorId: string,
    file: File,
    onUploadProgress?: (event: UploadProgressEvent) => void,
    signal?: AbortSignal
  ) => Promise<AsyncTaskInfo>;
}

export function uploadResultDataExtension(
  client: CustomGraphQLClient
): IUploadResultDataExtension {
  return {
    uploadResultData(
      connectionId: string,
      contextId: string,
      projectId: string,
      resultsId: string,
      processorId: string,
      file: File,
      onUploadProgress?: (event: UploadProgressEvent) => void,
      signal?: AbortSignal
    ): Promise<AsyncTaskInfo> {
      return client.uploadFile(
        GlobalConstants.absoluteServiceUrl('data', 'import'),
        file,
        undefined,
        { connectionId, contextId, projectId, resultsId, processorId },
        onUploadProgress,
        signal
      );
    }
  };
}
