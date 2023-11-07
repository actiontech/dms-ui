import {
  IListMonitorRoutineReply,
  IListRoutineMetricsReply
} from '../common.d';

export interface IV1ListMonitorRoutineParams {
  page_index?: number;

  page_size?: number;

  source_id: number;

  project_uid: string;
}

export interface IV1ListMonitorRoutineReturn extends IListMonitorRoutineReply {}

export interface IV1ListRoutineMetricsParams {
  page_index?: number;

  page_size?: number;

  routine_id: number;

  project_uid: string;
}

export interface IV1ListRoutineMetricsReturn extends IListRoutineMetricsReply {}
