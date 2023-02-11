import { atom } from 'recoil';
import { ServerPayloads } from '@euchre/shared/server/ServerPayloads';
import { ServerEvents } from '@euchre/shared/server/ServerEvents';

export const CurrentLobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});