import { EventModel } from "../models/event_model";

export interface EventBaseInterface {
    eventModel: EventModel,
    manageEvent: () => void,
}