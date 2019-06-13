export interface Action {
    name?: string;
    icon?: string;
}

export class Power implements Action{
    name?: string;
    icon?: string;
    power: boolean;
}

export class Height implements Action{
    name?: string;
    icon?: string;
    height: number;
}

export class Open implements Action{
    name?: string;
    icon?: string;
    open: boolean;
}
export class Lock implements Action{
    name?: string;
    icon?: string;
    locked: boolean;
}
