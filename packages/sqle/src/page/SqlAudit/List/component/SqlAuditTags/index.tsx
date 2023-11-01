export interface ISqlAuditTags {
  projectID: string;
  defaultTags: string[];
  updateTags: (tags: string[]) => void;
}
const SqlAuditTags = ({
  projectID,
  defaultTags,
  updateTags
}: ISqlAuditTags) => {
  return <>SqlAuditTags</>;
};

export default SqlAuditTags;
