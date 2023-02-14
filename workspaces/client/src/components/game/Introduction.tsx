import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Divider, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { ClientEvents } from '@euchre/shared/client/ClientEvents';
import useSocketManager from '@hooks/useSocketManager';
import { emitEvent } from '@utils/analytics';

export default function Introduction() {
  const router = useRouter();
  const {sm} = useSocketManager();
  const [playerName, setPlayerName] = useInputState<string>('');

  useEffect(() => {
    if (router.query.lobby) {
      sm.emit({
        event: ClientEvents.LobbyJoin,
        data: {
          lobbyId: router.query.lobby,
          playerName: playerName,
        },
      });
    }
  }, [router]);

  const onCreateLobby = () => {
    sm.emit({
      event: ClientEvents.LobbyCreate,
      data: {
        playerName: playerName,
      },
    });

    emitEvent('lobby_create');
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl">Hello! 👋</h2>

      <p className="mt-3 text-lg">
        This is an implementation of the card game Euchre. It's extremely a work in progress at the moment.
      </p>

      <Divider my="md"/>

      <div>
        <h3 className="text-xl">Game options</h3>

        <TextInput
          placeholder="Enter your name"
          label="Your name"
          value={playerName}
          onChange={setPlayerName}
          required
        />
      </div>

      <div className="mt-5 text-center flex justify-evenly">
        <button className="btn" onClick={() => onCreateLobby()}>Create game</button>
        {/* <button className="btn" onClick={() => onCreateLobby()}>Join game</button> */}
      </div>
    </div>
  );
}