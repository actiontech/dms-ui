import { IListMonitorRoutineReply } from '../common.d';

export interface IV1ListMonitorRoutineParams {
  page_index?: number;

  page_size?: number;

  source_id: number;

  project_uid: string;
}

export interface IV1ListMonitorRoutineReturn extends IListMonitorRoutineReply {}
