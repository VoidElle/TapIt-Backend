import {EventBaseInterface} from "../interfaces/event_base_interface";
import {EventModel} from "../models/event_model";
import {CustomLogger, LogType} from "../utils/custom_logger";

export class DisconnectionEvent implements EventBaseInterface {

    eventModel: EventModel;

    constructor(eventModel: EventModel) {
        this.eventModel = eventModel;
    }

    async manageEvent(): Promise<void> {

        CustomLogger.log(LogType.INFO, `Socket disconnected (${this.eventModel.socket.id})`);

        // Get the list of rooms that the socket is inside
        const rooms: Set<string> = this.eventModel.socket.rooms;
        for (const room of rooms) {

            // Considering that each socket joins a room that has his socket id,
            // we need to check to not quit that for socket.io to work
            if (room != this.eventModel.socket.id) {
                return;
            }

            // Make the socket leave the lobby
            await this.eventModel.socket.leave(room);
            CustomLogger.log(LogType.INFO, `Socket ${this.eventModel.socket.id} left lobby ${room}`)

            // Todo: Emit success event

        }

    }

}