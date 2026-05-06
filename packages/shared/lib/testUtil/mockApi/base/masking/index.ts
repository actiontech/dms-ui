import { MockSpyApy, createSpySuccessResponse } from '../../common';
import Masking from '../../../../api/base/service/Masking';
import {
  creatableDBServicesForMaskingTaskData,
  maskingOverviewTreeData,
  maskingRulesData,
  maskingRulesV2Data,
  maskingRuleDetailData,
  maskingTemplatesData,
  sensitiveDataDiscoveryTasksData,
  sensitiveDataDiscoveryTaskHistoriesData,
  sensitiveTypesData,
  suspectedSensitiveFieldsTreeData,
  tableColumnMaskingDetailsData
} from './data';

class MockMaskingApi implements MockSpyApy {
  public mockAllApi(): void {
    this.ListMaskingRules();
    this.ListMaskingRulesV2();
    this.ListSensitiveDataDiscoveryTasks();
    this.GetMaskingOverviewTree();
    this.GetTableColumnMaskingDetails();
    this.ListCreatableDBServicesForMaskingTask();
    this.ListMaskingTemplates();
    this.AddSensitiveDataDiscoveryTask();
    this.UpdateSensitiveDataDiscoveryTask();
    this.DeleteSensitiveDataDiscoveryTask();
    this.ConfigureMaskingRules();
    this.AddMaskingTemplate();
    this.UpdateMaskingTemplate();
    this.DeleteMaskingTemplate();
    this.ListSensitiveDataDiscoveryTaskHistories();
    this.ListSensitiveTypes();
    this.AddCustomMaskingRule();
    this.UpdateCustomMaskingRule();
    this.DeleteCustomMaskingRule();
    this.GetMaskingRuleDetail();
    this.AddSensitiveDataType();
    this.PreviewMaskingEffect();
  }

  public ListSensitiveDataDiscoveryTasks() {
    const spy = jest.spyOn(Masking, 'ListSensitiveDataDiscoveryTasks');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: sensitiveDataDiscoveryTasksData.length,
        data: sensitiveDataDiscoveryTasksData
      })
    );
    return spy;
  }

  public GetMaskingOverviewTree() {
    const spy = jest.spyOn(Masking, 'GetMaskingOverviewTree');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: maskingOverviewTreeData
      })
    );
    return spy;
  }

  public GetTableColumnMaskingDetails() {
    const spy = jest.spyOn(Masking, 'GetTableColumnMaskingDetails');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: tableColumnMaskingDetailsData
      })
    );
    return spy;
  }

  public ListMaskingRules() {
    const spy = jest.spyOn(Masking, 'ListMaskingRules');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: maskingRulesData
      })
    );
    return spy;
  }

  public ListMaskingRulesV2() {
    const spy = jest.spyOn(Masking, 'ListMaskingRulesV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: maskingRulesV2Data,
        total_nums: maskingRulesV2Data.length
      })
    );
    return spy;
  }

  public ListCreatableDBServicesForMaskingTask() {
    const spy = jest.spyOn(Masking, 'ListCreatableDBServicesForMaskingTask');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: creatableDBServicesForMaskingTaskData
      })
    );
    return spy;
  }

  public ListMaskingTemplates() {
    const spy = jest.spyOn(Masking, 'ListMaskingTemplates');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: maskingTemplatesData
      })
    );
    return spy;
  }

  public AddSensitiveDataDiscoveryTask() {
    const spy = jest.spyOn(Masking, 'AddSensitiveDataDiscoveryTask');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          suspected_sensitive_fields_tree: suspectedSensitiveFieldsTreeData
        }
      })
    );
    return spy;
  }

  public UpdateSensitiveDataDiscoveryTask() {
    const spy = jest.spyOn(Masking, 'UpdateSensitiveDataDiscoveryTask');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DeleteSensitiveDataDiscoveryTask() {
    const spy = jest.spyOn(Masking, 'DeleteSensitiveDataDiscoveryTask');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public ConfigureMaskingRules() {
    const spy = jest.spyOn(Masking, 'ConfigureMaskingRules');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public AddMaskingTemplate() {
    const spy = jest.spyOn(Masking, 'AddMaskingTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public UpdateMaskingTemplate() {
    const spy = jest.spyOn(Masking, 'UpdateMaskingTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DeleteMaskingTemplate() {
    const spy = jest.spyOn(Masking, 'DeleteMaskingTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public ListSensitiveDataDiscoveryTaskHistories() {
    const spy = jest.spyOn(Masking, 'ListSensitiveDataDiscoveryTaskHistories');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: sensitiveDataDiscoveryTaskHistoriesData.length,
        data: sensitiveDataDiscoveryTaskHistoriesData
      })
    );
    return spy;
  }

  public ListSensitiveTypes() {
    const spy = jest.spyOn(Masking, 'ListSensitiveTypes');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: sensitiveTypesData
      })
    );
    return spy;
  }

  public AddCustomMaskingRule() {
    const spy = jest.spyOn(Masking, 'AddCustomMaskingRule');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: { rule_id: 100 }
      })
    );
    return spy;
  }

  public UpdateCustomMaskingRule() {
    const spy = jest.spyOn(Masking, 'UpdateCustomMaskingRule');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public DeleteCustomMaskingRule() {
    const spy = jest.spyOn(Masking, 'DeleteCustomMaskingRule');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public GetMaskingRuleDetail() {
    const spy = jest.spyOn(Masking, 'GetMaskingRuleDetail');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: maskingRuleDetailData
      })
    );
    return spy;
  }

  public AddSensitiveDataType() {
    const spy = jest.spyOn(Masking, 'AddSensitiveDataType');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: { sensitive_data_type_id: 200 }
      })
    );
    return spy;
  }

  public PreviewMaskingEffect() {
    const spy = jest.spyOn(Masking, 'PreviewMaskingEffect');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: { masked_output_list: ['***'] }
      })
    );
    return spy;
  }
}

export default new MockMaskingApi();
