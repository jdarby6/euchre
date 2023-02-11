import { Cards } from '@euchre/shared/common/Cards';
import {
  Back,
  Clubs5,
  Clubs9,
  Clubs10,
  ClubsJ,
  ClubsQ,
  ClubsK,
  ClubsA,
  Diamonds5,
  Diamonds9,
  Diamonds10,
  DiamondsJ,
  DiamondsQ,
  DiamondsK,
  DiamondsA,
  Hearts5,
  Hearts9,
  Hearts10,
  HeartsJ,
  HeartsQ,
  HeartsK,
  HeartsA,
  Spades5,
  Spades9,
  Spades10,
  SpadesJ,
  SpadesQ,
  SpadesK,
  SpadesA,
} from '@icons/cards/index';

export const CardsMap = (card: Cards | null) => {
  switch (card) {
    case null:
      return Back;

    case Cards.Clubs5:
      return Clubs5;
    case Cards.Clubs9:
      return Clubs9;
    case Cards.Clubs10:
      return Clubs10;
    case Cards.ClubsJ:
      return ClubsJ;
    case Cards.ClubsQ:
      return ClubsQ;
    case Cards.ClubsK:
      return ClubsK;
    case Cards.ClubsA:
      return ClubsA;

    case Cards.Diamonds5:
      return Diamonds5;
    case Cards.Diamonds9:
      return Diamonds9;
    case Cards.Diamonds10:
      return Diamonds10;
    case Cards.DiamondsJ:
      return DiamondsJ;
    case Cards.DiamondsQ:
      return DiamondsQ;
    case Cards.DiamondsK:
      return DiamondsK;
    case Cards.DiamondsA:
      return DiamondsA;

    case Cards.Hearts5:
      return Hearts5;
    case Cards.Hearts9:
      return Hearts9;
    case Cards.Hearts10:
      return Hearts10;
    case Cards.HeartsJ:
      return HeartsJ;
    case Cards.HeartsQ:
      return HeartsQ;
    case Cards.HeartsK:
      return HeartsK;
    case Cards.HeartsA:
      return HeartsA;

    case Cards.Spades5:
      return Spades5;
    case Cards.Spades9:
      return Spades9;
    case Cards.Spades10:
      return Spades10;
    case Cards.SpadesJ:
      return SpadesJ;
    case Cards.SpadesQ:
      return SpadesQ;
    case Cards.SpadesK:
      return SpadesK;
    case Cards.SpadesA:
      return SpadesA;
  }
};