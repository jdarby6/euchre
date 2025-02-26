import { Socket } from 'socket.io';
import { Lobby } from '@app/game/lobby/lobby';
import { ServerEvents } from '@shared/server/ServerEvents';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    playerName: null | string;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};