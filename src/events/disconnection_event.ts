import {EventBaseInterface} from "../interfaces/event_base_interface";
import {EventModel} from "../models/event_model";
import {CustomLogger, LogType} from "../utils/custom_logger";
import {eventsEmitter} from "../utils/events_emitter";
import {ServerEvents} from "../enums/server_events";

/**
 *
 * Input from the disconnecting socket to the Server:
 * null
 *
 * Output to everybody inside the Room:
 * {
 *     "socket": socketId
 * }
 */
export class DisconnectionEvent implements EventBaseInterface {

    eventModel: EventModel;

    constructor(eventModel: EventModel) {
        this.eventModel = eventModel;
    }

    public async manageEvent(): Promise<void> {

        CustomLogger.log(LogType.INFO, `Socket disconnected (${this.eventModel.socket.id})`);

        const data = {
            "socket": this.eventModel.socket.id,
        };

        // Get the list of rooms that the socket is inside
        const rooms: Set<string> = this.eventModel.socket.rooms;
        for (const room of rooms) {
            try {

                // Considering that each socket joins a room that has his socket id,
                // we need to check to not quit that for socket.io to work
                if (room != this.eventModel.socket.id) {
                    return;
                }

                // Make the socket leave the lobby
                await this.eventModel.socket.leave(room);
                CustomLogger.log(LogType.INFO, `Socket ${this.eventModel.socket.id} left lobby ${room}`);

                // Emit the success event
                eventsEmitter(room, ServerEvents.DISCONNECTION_RESPONSE_SUCCESS, data);

            } catch (error) {
                eventsEmitter(room, ServerEvents.DISCONNECTION_RESPONSE_SUCCESS, data);
            }
        }

    }

}