class LocalStorageWrapper {
  public set<T extends string = string>(key: string, value: T) {
    return localStorage.setItem(key, value);
  }

  public get(key: string) {
    return localStorage.getItem(key);
  }

  public getOrDefault(key: string, defaultValue: string): string {
    if (localStorage.getItem(key) === null) {
      return defaultValue;
    }
    return localStorage.getItem(key) as string;
  }

  public removeStartWith(key: string) {
    const storageLength = localStorage.length;
    for (let index = 0; index < storageLength; index++) {
      if (localStorage.key(index)?.startsWith(key)) {
        localStorage.removeItem(localStorage.key(index) ?? '');
      }
    }
  }

  public getKeyStartWith(key: string) {
    const storageLength = localStorage.length;
    for (let index = 0; index < storageLength; index++) {
      if (localStorage.key(index)?.startsWith(key)) {
        return localStorage.key(index);
      }
    }
  }
}

export default new LocalStorageWrapper();
