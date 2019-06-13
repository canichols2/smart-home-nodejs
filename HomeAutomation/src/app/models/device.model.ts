import { DeviceType } from './device-type.model';
import { Action } from './action.model';

export class Device {
    name: string;
    type: DeviceType;
    actions: Action[];
    owner?: string;
    authorizedUsers?: string[];
}



