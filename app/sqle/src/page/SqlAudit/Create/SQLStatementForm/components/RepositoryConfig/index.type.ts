export enum GitProtocolType {
  HTTP = 'http',
  GIT = 'git',
  SSH = 'ssh'
}

export interface RepositoryConfigProps {
  submitLoading: boolean;
}

export interface UseRepositoryConnectionReturn {
  branchOptions: { label: string; value: string }[];
  isConnectable: boolean;
  verifyConnection: () => Promise<void>;
  verifyConnectionLoading: boolean;
  connectionInfoHide: boolean;
  connectionErrorMsg?: string;
  initConnectionState: () => void;
}
