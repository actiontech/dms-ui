import { ActiontechTableActionMeta } from '@actiontech/shared/lib/components/ActiontechTable';
import { IPipelineNodeDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale';

export const PipelineConfigurationDetailListActions: (
  resetToken: (id: string) => void,
  resetTokenLoading: boolean
) => {
  buttons: ActiontechTableActionMeta<IPipelineNodeDetail>[];
} = (onResetToken, resetTokenActionPending) => {
  return {
    buttons: [
      {
        key: 'reset-token',
        text: t('pipelineConfiguration.table.resetToken'),
        confirm: (record) => {
          return {
            disabled: resetTokenActionPending,
            title: t('pipelineConfiguration.table.resetTokenConfirmTitle'),
            onConfirm: () => {
              onResetToken(record?.id?.toString() ?? '');
            }
          };
        }
      }
    ]
  };
};
