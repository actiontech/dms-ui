import { EventEmitter } from '@actiontech/dms-kit';
import EmitterKey from '../data/EmitterKey';

const eventEmitter = new EventEmitter<EmitterKey>();

export default eventEmitter;
