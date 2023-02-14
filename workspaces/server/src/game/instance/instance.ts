import { Socket } from 'socket.io';
import { Lobby } from '@app/game/lobby/lobby';
import { CardState } from '@app/game/instance/card-state';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { Cards } from '@shared/common/Cards';
import { Player } from '@shared/common/types';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';
import { SocketExceptions } from '@shared/server/SocketExceptions';

export class Instance
{
  public hasStarted: boolean = false;
  public hasFinished: boolean = false;
  public isSuspended: boolean = false;
  public currentRound: number = 1;
  public players: Map<Socket['id'], Player> = new Map<Socket['id'], Player>();
  public activePlayer: string = '';
  public currentDealer: string = '';
  public cards: CardState[] = [];
  public scores: Record<Socket['id'], number> = {};

  private cardsRevealedForCurrentRound: Record<number, Socket['id']> = {};

  /*

  Methods/Rules:
  - Exactly 4 players
  - 2 teams of 2 (should these be chosen randomly? or let players choose? maybe option for either)
  - Teammates sit across from each other (so no two teammates go right after each other)
  - Shuffle cards
  - Deal cards (2s and 3s)
  - Need to maintain who is the dealer
  - Choosing trump suit phase
    - Option to go alone
  - Need to maintain which team were the "makers" (the team that picked the trump suit). Matters for scoring
  - Player to the left of the dealer starts the first turn
  - Players have to play a card from that suit if they're able
  - Need to maintain whose turn it is, and don't let players play out of order
  - Check for winner (remember trump rules about left and right bower)
  - Winner of that trick plays the first card for the next round
  - Once all 5 cards are played, score the round
  - Dealer passes to the left
  - Continue playing rounds until one team reaches 10 points

  */

  constructor(
    private readonly lobby: Lobby,
  )
  {
    this.initializeCards();
  }

  public triggerStart(): void
  {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game started!',
    });
  }

  public triggerFinish(): void
  {
    if (this.hasFinished || !this.hasStarted) {
      return;
    }

    this.hasFinished = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game finished!',
    });
  }

  public revealCard(cardIndex: number, client: AuthenticatedSocket): void
  {
    if (this.isSuspended || this.hasFinished || !this.hasStarted) {
      return;
    }

    // Make sure player didn't play two time already for this round
    let cardAlreadyRevealedCount = 0;

    for (const clientId of Object.values(this.cardsRevealedForCurrentRound)) {
      if (clientId === client.id) {
        cardAlreadyRevealedCount++;
      }
    }

    if (cardAlreadyRevealedCount >= 2) {
      return;
    }

    const cardState = this.cards[cardIndex];

    if (!cardState) {
      throw new ServerException(SocketExceptions.GameError, 'Card index invalid');
    }

    // If card is already revealed then stop now, no need to reveal it again
    if (cardState.isRevealed) {
      return;
    }

    cardState.isRevealed = true;
    cardState.ownerId = client.id;

    // this.cardsRevealedForCurrentRound.push(cardIndex);
    this.cardsRevealedForCurrentRound[cardIndex] = cardState.ownerId;

    client.emit<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'You revealed card',
    });

    // If everyone played (revealed 2 cards) then go to next round
    const everyonePlayed = Object.values(this.cardsRevealedForCurrentRound).length === this.lobby.clients.size * 2;

    // If every card have been revealed then go to next round
    let everyCardRevealed = true;

    for (const card of this.cards) {
      if (!card.isRevealed) {
        everyCardRevealed = false;

        break;
      }
    }

    if (everyonePlayed || everyCardRevealed) {
      this.transitionToNextRound();
    }

    this.lobby.dispatchLobbyState();
  }

  private transitionToNextRound(): void
  {
  }

  private initializeCards(): void
  {
    // Get only values, not identifiers
    const cards = Object.values(Cards).filter(c => Number.isInteger(c)) as Cards[];

    for (const card of cards) {
      const cardState = new CardState(card);

      this.cards.push(cardState);
    }

    // Shuffle array randomly
    this.cards = this.cards.sort((a, b) => 0.5 - Math.random());
  }
}