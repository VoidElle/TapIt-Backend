import {EventBaseInterface} from "../interfaces/event_base_interface";
import {EventModel} from "../models/event_model";
import {CustomLogger, LogType} from "../utils/custom_logger";

export class CreateLobbyEvent implements EventBaseInterface {

    eventModel: EventModel;

    constructor(eventModel: EventModel) {
        this.eventModel = eventModel;
    }

    async manageEvent(): Promise<void> {
        CustomLogger.log(LogType.INFO, `Create lobby event (${this.eventModel.socket.id})`);
    }

}