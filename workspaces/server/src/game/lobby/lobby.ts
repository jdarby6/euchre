import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from '@shared/server/ServerEvents';
import { AuthenticatedSocket } from '@app/game/types';
import { Instance } from '@app/game/instance/instance';
import { ServerPayloads } from '@shared/server/ServerPayloads';

export class Lobby
{
  public readonly id: string = v4();
  public readonly createdAt: Date = new Date();
  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();
  public readonly instance: Instance = new Instance(this);
  public readonly maxClients = 4;

  constructor(
    private readonly server: Server,
  )
  {
  }

  public addClient(client: AuthenticatedSocket, playerName: string): void
  {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;
    client.data.playerName = playerName;

    if (this.clients.size >= this.maxClients) {
      this.instance.triggerStart();
    }

    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void
  {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    // If player leaves, end the game
    this.instance.triggerFinish();

    // Alert the remaining players that a player left
    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Opponent left lobby',
    });

    this.dispatchLobbyState();
  }

  public dispatchLobbyState(): void
  {
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
      currentRound: this.instance.currentRound,
      activePlayer: this.instance.activePlayer,
      currentDealer: this.instance.currentDealer,
      cards: this.instance.cards.map(card => card.toDefinition()),
      isSuspended: this.instance.isSuspended,
      scores: this.instance.scores,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void
  {
    this.server.to(this.id).emit(event, payload);
  }
}