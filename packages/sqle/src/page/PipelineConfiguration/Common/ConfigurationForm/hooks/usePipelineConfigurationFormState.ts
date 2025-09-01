import { Form } from 'antd';
import { useBoolean } from 'ahooks';
import {
  updateSelectPipelineId,
  updatePipelineNodeTourStatus,
  updatePipelineModalStatus
} from '../../../../../store/pipeline';
import { ModalName } from '../../../../../data/ModalName';
import { useCallback } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useDispatch } from 'react-redux';
import { PipelineFormType } from '../index.type';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

const usePipelineConfigurationFormState = () => {
  const navigate = useTypedNavigate();

  const dispatch = useDispatch();

  const { projectName, projectID } = useCurrentProject();

  const [form] = Form.useForm<PipelineFormType>();

  const [submitLoading, { setTrue: startSubmit, setFalse: finishSubmit }] =
    useBoolean(false);

  const [
    submitSuccessStatus,
    { setTrue: successfulSubmit, setFalse: backToForm }
  ] = useBoolean(false);

  const setSelectPipelineId = useCallback(
    (id?: number) => {
      dispatch(updateSelectPipelineId({ id }));
    },
    [dispatch]
  );

  const openPipelineDetailModal = useCallback(async () => {
    dispatch(
      updatePipelineModalStatus({
        modalName: ModalName.Pipeline_Configuration_Detail_Modal,
        status: true
      })
    );
    dispatch(updatePipelineNodeTourStatus({ show: true }));
    navigate(ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.index, {
      params: { projectID }
    });
  }, [projectID, navigate, dispatch]);

  return {
    form,
    submitLoading,
    startSubmit,
    finishSubmit,
    submitSuccessStatus,
    successfulSubmit,
    backToForm,
    openPipelineDetailModal,
    setSelectPipelineId,
    projectName,
    projectID
  };
};

export default usePipelineConfigurationFormState;
