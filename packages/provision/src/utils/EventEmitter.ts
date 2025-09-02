import { EventEmitterKey } from '~/data/enum';

import { EventEmitter } from '@actiontech/shared';

const eventEmitter = new EventEmitter<EventEmitterKey>();

export default eventEmitter;
