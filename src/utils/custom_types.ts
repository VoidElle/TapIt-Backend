import {EventBaseInterface} from "../interfaces/event_base_interface";

export type EventHandlingType = {
    [key: string]: (...args: any[]) => EventBaseInterface;
}