import { Socket } from 'socket.io';
import { ServerEvents } from './ServerEvents';
import { CardStateDefinition } from '../common/types';

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    hasStarted: boolean;
    hasFinished: boolean;
    currentRound: number;
    activePlayer: string;
    currentDealer: string;
    cards: CardStateDefinition[];
    isSuspended: boolean;
    scores: Record<string, number>;
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: 'green' | 'red' | 'blue' | 'orange';
  };
};