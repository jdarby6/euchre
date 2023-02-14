import { Cards, CardStates } from './Cards';

export type CardStateDefinition = {
  card: Cards | null;
  owner: string | null;
  state: CardStates | null;
};

export type Player = {
  id: number;
  name: string;
  team: number;
  cards: CardStateDefinition[];
};