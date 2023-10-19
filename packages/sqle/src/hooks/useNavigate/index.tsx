import { SQLE_BASE_URL } from '@actiontech/shared/lib/data/common';
import { useNavigate } from '@actiontech/shared/lib/hooks';

/**
 * @deprecated 后续会移除该 hooks, 需要在重构过程中替换会原生 useNavigate
 */
const useSqleNavigate = () => useNavigate(SQLE_BASE_URL);

export default useSqleNavigate;
