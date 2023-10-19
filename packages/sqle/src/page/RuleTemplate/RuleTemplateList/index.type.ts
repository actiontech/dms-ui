export enum EnumTemplateType {
  'project' = 'project',
  'common' = 'common'
}

export type typeTemplateType =
  (typeof EnumTemplateType)[keyof typeof EnumTemplateType];

export const TemplateTypeData = Object.values(EnumTemplateType);

export type TemplateTableProps = {
  hidden: boolean;
  actionPermission?: boolean;
};
