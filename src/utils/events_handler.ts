import { Socket} from "socket.io";
import { EventHandlingType } from "./custom_types";
import { ClientEvents } from "../enums/client_events";
import { DisconnectionEvent } from "../events/disconnection_event";
import { EventModel } from "../models/event_model";
import { EventBaseInterface } from "../interfaces/event_base_interface";

export default function eventsHandling(socket: Socket): void {

    const eventHandlers: EventHandlingType = {

        // Core events
        [ClientEvents.DISCONNECT]: () => new DisconnectionEvent(new EventModel(undefined, socket)),

        /*
        [Events.JOIN_LOBBY_REQUEST]: (lobbyId: string) => new JoinLobbyEvent(lobbyId, socket, io),
        [Events.QUIT_LOBBY_REQUEST]: (lobbyId: string) => new QuitLobbyEvent(lobbyId, socket, io),
        [Events.PLAYER_CHANGE_READY_STATUS]: (lobbyId: string) => new PlayerChangeReadyStatusEvent(lobbyId, socket, io),
        [Events.START_LOBBY_REQUEST]: (lobbyId: string) => new StartLobbyEvent(lobbyId, socket, io)
        */

    };

    // Loop for listening all the events
    Object.keys(eventHandlers).forEach((event: string): void => {
        socket.on(event, async (...args: any[]): Promise<void> => {

            const handler: EventBaseInterface = eventHandlers[event](...args);
            if (!handler || !handler.manageEvent) {
                return;
            }

            await handler.manageEvent();
        });
    });

}