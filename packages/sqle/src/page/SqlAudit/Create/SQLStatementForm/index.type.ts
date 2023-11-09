export enum SQLUploadType {
  sql,
  sqlFile,
  xmlFile,
  zipFile,
  git
}

export type TypeUploadKeys = keyof typeof SQLUploadType;

export const SQLUploadTypeKeys: TypeUploadKeys[] = Object.keys(
  SQLUploadType
).filter((key) => isNaN(parseInt(key))) as TypeUploadKeys[];
