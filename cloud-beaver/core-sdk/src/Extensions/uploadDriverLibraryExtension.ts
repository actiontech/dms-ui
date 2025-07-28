import type {
  CustomGraphQLClient,
  UploadProgressEvent
} from '../CustomGraphQLClient';
import { GlobalConstants } from '../utils/GlobalConstants';

export interface IUploadDriverLibraryExtension {
  uploadDriverLibrary: (
    driverId: string,
    files: File[],
    onUploadProgress?: (event: UploadProgressEvent) => void
  ) => Promise<void>;
}

export function uploadDriverLibraryExtension(
  client: CustomGraphQLClient
): IUploadDriverLibraryExtension {
  return {
    uploadDriverLibrary(
      driverId: string,
      files: File[],
      onUploadProgress?: (event: UploadProgressEvent) => void
    ): Promise<void> {
      return client.uploadFiles(
        GlobalConstants.absoluteServiceUrl('drivers', 'library'),
        files,
        undefined,
        { driverId },
        onUploadProgress
      );
    }
  };
}
