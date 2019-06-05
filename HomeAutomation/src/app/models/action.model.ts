export interface Action {
    name?: string;
}

export interface Power extends Action{
    power: boolean;
}

export interface Height extends Action{
    height: number;
}

export interface Open extends Action{
    open: boolean;
}
