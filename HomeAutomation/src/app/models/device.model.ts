import { DeviceType } from './device-type.model';
import { Action } from './action.model';

export interface Device {
    name: string;
    type: DeviceType;
    actions: Action[];
    owner?: string;
    authorizedUsers?: string[];
}



