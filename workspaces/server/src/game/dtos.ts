import { IsNumber, IsString } from 'class-validator';
import { Cards } from '@shared/common/Cards';

export class LobbyCreateDto
{
  @IsString()
  playerName: string;
}

export class LobbyJoinDto
{
  @IsString()
  lobbyId: string;

  @IsString()
  playerName: string;
}

export class RevealCardDto
{
  @IsNumber()
  cardIndex: Cards;
}