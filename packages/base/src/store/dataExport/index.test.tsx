import { IReduxState } from '..';
import reducers, {
  CreateDataExportPageEnum,
  updateCreateDataExportFormValues,
  updateCreateDataExportPageState,
  updateDataExportAuditedTaskID,
  updateDataExportCreatedWorkflowID,
  clearDataExportAllCreateState,
  updateDataExportDetailWorkflowStepOpen,
  updateDataExportDetailWorkflowRejectOpen,
  updateDataExportDetailWorkflowInfo,
  updateDataExportDetailTaskInfos,
  updateDataExportDetailCurTaskID,
  updateDataExportDetailTaskStatusNumber,
  updateDataExportDetailCanRejectWorkflow,
  clearDataExportAllDetailState,
  updateCreateDataExportAuditLoading,
  updateCreateDataExportSubmitLoading
} from '.';
import { ExportMethodEnum } from '../../page/DataExportManagement/Create/components/CreateTask/ExportMethodForm/index.enum';

describe('store/dataExport', () => {
  const state: IReduxState['dataExport'] = {
    modalStatus: {},
    create: {
      formValues: null,
      pageState: CreateDataExportPageEnum.CREATE_TASK,
      auditLoading: false,
      submitLoading: false,
      taskIDs: null,
      workflowID: null
    },
    detail: {
      workflowStepOpen: false,
      workflowRejectOpen: false,
      workflowInfo: null,
      taskInfos: null,
      curTaskID: null,
      taskStatusNumber: null,
      canRejectWorkflow: true
    }
  };

  it('should execute updateCreateDataExportFormValues', () => {
    const formValuesData = {
      formValues: {
        baseValues: { workflow_subject: 'workflow_subject', desc: 'desc' },
        sourceValues: {
          business: 'business',
          dbService: 'dbService',
          schema: 'schema'
        },
        methodValues: {
          sql: 'sql',
          exportMethod: ExportMethodEnum.sql
        }
      }
    };
    const newState = reducers(
      state,
      updateCreateDataExportFormValues(formValuesData)
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: formValuesData.formValues,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateCreateDataExportPageState', () => {
    const newState = reducers(
      state,
      updateCreateDataExportPageState({
        pageState: CreateDataExportPageEnum.SUBMIT_RESULT
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.SUBMIT_RESULT,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateCreateDataExportAuditLoading', () => {
    const newState = reducers(
      state,
      updateCreateDataExportAuditLoading({
        auditLoading: true
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: true,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateCreateDataExportSubmitLoading', () => {
    const newState = reducers(
      state,
      updateCreateDataExportSubmitLoading({
        submitLoading: true
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: true,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateDataExportAuditedTaskID', () => {
    const newState = reducers(
      state,
      updateDataExportAuditedTaskID({
        taskIDs: ['ids']
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: ['ids'],
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateDataExportCreatedWorkflowID', () => {
    const newState = reducers(
      state,
      updateDataExportCreatedWorkflowID({
        workflowID: 'workflowID-id'
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: 'workflowID-id'
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute clearDataExportAllCreateState', () => {
    const newState = reducers(
      {
        modalStatus: {},
        create: {
          formValues: null,
          pageState: CreateDataExportPageEnum.CREATE_TASK,
          auditLoading: false,
          submitLoading: false,
          taskIDs: null,
          workflowID: 'workflowID-id'
        },
        detail: {
          workflowStepOpen: false,
          workflowRejectOpen: false,
          workflowInfo: null,
          taskInfos: null,
          curTaskID: null,
          taskStatusNumber: null,
          canRejectWorkflow: true
        }
      },
      clearDataExportAllCreateState()
    );
    expect(newState).toEqual(state);
  });

  it('should execute updateDataExportDetailWorkflowStepOpen', () => {
    const newState = reducers(
      state,
      updateDataExportDetailWorkflowStepOpen({
        workflowStepOpen: true
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: true,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateDataExportDetailWorkflowRejectOpen', () => {
    const newState = reducers(
      state,
      updateDataExportDetailWorkflowRejectOpen({
        workflowRejectOpen: true
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: true,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateDataExportDetailWorkflowInfo', () => {
    const workflowInfoData = {
      workflow_uid: 'workflow_uid',
      workflow_name: 'workflow_name'
    };
    const newState = reducers(
      state,
      updateDataExportDetailWorkflowInfo({
        workflowInfo: workflowInfoData
      })
    );

    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: workflowInfoData,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateDataExportDetailTaskInfos', () => {
    const taskInfosData = [
      {
        task_uid: 'task_uid',
        task_name: 'task_name',
        task_status: 1,
        task_status_name: 'task_status_name',
        task_status_number: 1
      }
    ];
    const newState = reducers(
      state,
      updateDataExportDetailTaskInfos({
        taskInfos: taskInfosData
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: taskInfosData,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateDataExportDetailCurTaskID', () => {
    const newState = reducers(
      state,
      updateDataExportDetailCurTaskID({
        taskID: 'taskID string'
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: 'taskID string',
        taskStatusNumber: null,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateDataExportDetailTaskStatusNumber', () => {
    const taskStatusNumberData = {
      success: 0,
      failed: 0,
      exporting: 0
    };
    const newState = reducers(
      state,
      updateDataExportDetailTaskStatusNumber({
        taskStatusNumber: taskStatusNumberData
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: taskStatusNumberData,
        canRejectWorkflow: true
      }
    });
  });

  it('should execute updateDataExportDetailCanRejectWorkflow', () => {
    const newState = reducers(
      state,
      updateDataExportDetailCanRejectWorkflow({
        canRejectWorkflow: false
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      create: {
        formValues: null,
        pageState: CreateDataExportPageEnum.CREATE_TASK,
        auditLoading: false,
        submitLoading: false,
        taskIDs: null,
        workflowID: null
      },
      detail: {
        workflowStepOpen: false,
        workflowRejectOpen: false,
        workflowInfo: null,
        taskInfos: null,
        curTaskID: null,
        taskStatusNumber: null,
        canRejectWorkflow: false
      }
    });
  });

  it('should execute clearDataExportAllDetailState', () => {
    const newState = reducers(
      {
        modalStatus: {},
        create: {
          formValues: null,
          pageState: CreateDataExportPageEnum.CREATE_TASK,
          auditLoading: false,
          submitLoading: false,
          taskIDs: null,
          workflowID: null
        },
        detail: {
          workflowStepOpen: true,
          workflowRejectOpen: true,
          workflowInfo: null,
          taskInfos: null,
          curTaskID: null,
          taskStatusNumber: null,
          canRejectWorkflow: true
        }
      },
      clearDataExportAllDetailState()
    );
    expect(newState).toEqual(state);
  });
});
