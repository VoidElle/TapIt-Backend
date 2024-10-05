import {ServerSingleton} from "../singletons/server_singleton";
import {ServerEvents} from "../enums/server_events";

export function eventsEmitter(room: string, event: ServerEvents, data: object) {
    ServerSingleton.instance.io.to(room).emit(event, data);
}