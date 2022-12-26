import { useState } from "react";
import styled from "styled-components";
import { Button } from "../Components/Button/GameButton";
import { FullScreen } from "../Components/Modal/FullScreen";
import TetrisBoard from "../Components/TetrisBoard";
import sound from "../resource/BGM/BGM.mp3";
import backgroundImg from "../resource/image/mrhyo.jpg";
import icon from "../resource/image/icon.png";
import Helmet from "react-helmet";
interface WrapperImg {
  bgURL: string;
}

const Wrapper = styled.div<WrapperImg>`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(${(props) => props.bgURL});
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
  .guide {
    border: 5px solid black;
    padding: 5px 10px;
    background-color: white;
    margin-bottom: 1rem;
    margin-right: 300px;
    font-weight: 600;
    font-size: 16px;
    color: black;
    p {
      color: black;
      font-size: 18px;
      text-align: center;
      margin-bottom: 1rem;
    }
  }
`;

const Tetris = () => {
  const [gameStart, setGameStart] = useState<boolean>(false);
  const audioElement = new Audio(sound);

  const onClick = () => {
    setGameStart((prev) => true);
  };

  return (
    <Wrapper bgURL={backgroundImg}>
      <Helmet>
        <link rel="shortcut icon" href={icon} type="image/x-icon" />
        <title>Tetris</title>
      </Helmet>
      {!gameStart && (
        <FullScreen>
          <Button onClick={onClick}>START</Button>
        </FullScreen>
      )}
      <div className="guide">
        <p>조작법</p>
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
