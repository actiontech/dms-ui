import { useMemo } from 'react';
import UserGuideModal from './UserGuideModal';
import queryString from 'query-string';
import {
  EmptyBox,
  SQL_WORKBENCH_FROM_PARAM_NAME,
  ODC_WORKBENCH_NAME
} from '@actiontech/dms-kit';

const UserGuide = () => {
  const isNotFormODC = useMemo(() => {
    const parsedQuery = queryString.parse(location.search);

    return parsedQuery[SQL_WORKBENCH_FROM_PARAM_NAME] !== ODC_WORKBENCH_NAME;
  }, []);

  return (
    <EmptyBox if={isNotFormODC}>
      <UserGuideModal />
    </EmptyBox>
  );
};

export default UserGuide;
