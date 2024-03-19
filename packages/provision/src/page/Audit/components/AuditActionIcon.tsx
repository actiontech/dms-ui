import {
  IconAuditStatusIsCreated,
  IconAuditStatusIsDeleted,
  IconAuditStatusIsUpdated
} from '~/icon/audit';

const AuditActionIcon: React.FC<{ value: string | undefined }> = ({
  value
}) => {
  if (value && /_created$/.test(value)) {
    return <IconAuditStatusIsCreated />;
  } else if (value && /_deleted$/.test(value)) {
    return <IconAuditStatusIsDeleted />;
  } else if (value && /_updated$/.test(value)) {
    return <IconAuditStatusIsUpdated />;
  }
  return null;
};

export default AuditActionIcon;
