/**
 * Do not modify this file in the dms-ui repository
 */

import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';

type Props = {
  visible: boolean;
  projectUID: string;
  initialDbService: IListDBServiceV2 | null;
  onClose: () => void;
  onSuccess: () => void;
};

const CreateTaskModal: React.FC<Props> = () => {
  return null;
};

export default CreateTaskModal;
