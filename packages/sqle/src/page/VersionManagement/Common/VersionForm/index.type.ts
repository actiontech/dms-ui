export type VersionFormType = {
  desc?: string;
  version: string;
  stages: Array<{
    name: string;
    instances: Array<string | undefined>;
  }>;
};
