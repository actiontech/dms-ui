export interface IModuleBase<T extends Record<string, any>> {
  config: T;
  run: () => Promise<void>;
}
