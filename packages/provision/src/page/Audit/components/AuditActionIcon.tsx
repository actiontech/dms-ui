import {
  AdvancedHexagonFilled,
  CheckHexagonOutlined,
  InfoHexagonOutlined
} from '@actiontech/icons';

const AuditActionIcon: React.FC<{ value: string | undefined }> = ({
  value
}) => {
  if (value && /_created$/.test(value)) {
    return <CheckHexagonOutlined />;
  } else if (value && /_deleted$/.test(value)) {
    return <InfoHexagonOutlined />;
  } else if (value && /_updated$/.test(value)) {
    return <AdvancedHexagonFilled />;
  }
  return null;
};

export default AuditActionIcon;
