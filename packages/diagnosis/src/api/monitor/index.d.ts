import {
  IListMonitorRoutinesReply,
  IListMonitorMetricsReply
} from '../common.d';

export interface IV1ListMonitorRoutineParams {
  page_index?: number;

  page_size?: number;

  source_id: string;
}

export interface IV1ListMonitorRoutineReturn
  extends IListMonitorRoutinesReply {}

export interface IV1ListRoutineMetricsParams {
  monitor_id: number;

  page_index?: number;

  page_size?: number;
}

export interface IV1ListRoutineMetricsReturn extends IListMonitorMetricsReply {}
