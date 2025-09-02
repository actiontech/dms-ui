import { EventEmitter } from '@actiontech/shared';
import EmitterKey from '../data/EmitterKey';

const eventEmitter = new EventEmitter<EmitterKey>();

export default eventEmitter;
