export type VersionStage = {
  name: string;
  instances: Array<string | undefined>;
};

export type VersionFormType = {
  desc?: string;
  version: string;
  stages: Array<VersionStage>;
};
