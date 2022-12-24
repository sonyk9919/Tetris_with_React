import { useState } from "react";
import styled from "styled-components";
import { Button } from "../Components/Button/GameButton";
import { FullScreen } from "../Components/Modal/FullScreen";
import TetrisBoard from "../Components/TetrisBoard";
import sound from "../resource/BGM/BGM.mp3";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .guide {
    margin-bottom: 1rem;
    padding-right: 300px;
    font-weight: 600;
    font-size: 12px;
  }
`;

const Tetris = () => {
  const [gameStart, setGameStart] = useState<boolean>(false);
  const audioElement = new Audio(sound);

  const onClick = () => {
    setGameStart((prev) => true);
  };

  return (
    <Wrapper>
      {!gameStart && (
        <FullScreen>
          <Button onClick={onClick}>START</Button>
        </FullScreen>
      )}
      <div className="guide">
        블록 이동: 좌우 방향키
        <br />
        방향전환: Ctrl
        <br /> 빠르게 내리기 Space
      </div>
      <TetrisBoard gameStart={gameStart} audioElement={audioElement} />
    </Wrapper>
  );
};

export default Tetris;
