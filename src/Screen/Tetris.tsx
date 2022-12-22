import styled from "styled-components";
import TetrisBoard from "../Components/TetrisBoard";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Tetris = () => {
  return (
    <Wrapper>
      <TetrisBoard />
    </Wrapper>
  );
};

export default Tetris;
