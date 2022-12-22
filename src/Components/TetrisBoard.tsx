import { useEffect, useState } from "react";
import styled from "styled-components";

const TetrisWrapper = styled.div`
  width: 600px;
  height: 1200px;
  border: 5px solid purple;
  box-shadow: 10px 20px 50px black;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  .tree {
    background-color: #71e471;
  }
`;

const TetrisBlock = styled.div`
  border: 1px solid black;
`;

const initialBlock = {
  tree: [
    [
      [1, 2],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 0],
    ],
  ],
};

interface INowBlock {
  type: "tree";
  direction: number;
  top: number;
  left: number;
}

const nowBlock: INowBlock = {
  type: "tree",
  direction: 0,
  top: 0,
  left: 3,
};

const TetrisBoard = () => {
  const renderNode = (prev: number[]) => {
    const blocks = initialBlock[nowBlock.type][nowBlock.direction];
    const render = blocks.map((block) => {
      const x = block[0] + nowBlock.top;
      const y = block[1] + nowBlock.left;
      return x * 10 + y;
    });

    const preRightCheck = prev.find((item) => item % 10 === 9);
    const nowRightCheck = render.find((item) => item % 10 === 0);

    if (preRightCheck && nowRightCheck) {
      nowBlock.left -= 1;
      return prev;
    }

    const preLeftCheck = prev.find((item) => item % 10 === 0);
    const nowLeftCheck = render.find((item) => item % 10 === 9);

    if (preLeftCheck && nowLeftCheck) {
      nowBlock.left += 1;
      return prev;
    }

    return render;
  };
  const Init = () => {
    const arr1 = [];
    for (let i = 0; i < 20; i++) {
      const arr2 = [];
      for (let j = 0; j < 10; j++) {
        arr2.push(i * 10 + j);
      }
      arr1.push(arr2);
    }
    return arr1.map((item1) =>
      item1.map((item2) => (
        <TetrisBlock
          key={item2}
          className={
            render.find((item3) => item3 === item2) !== undefined
              ? nowBlock.type
              : ""
          }
        >
          {item2}
        </TetrisBlock>
      ))
    );
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const { key } = e;
    if (key === "ArrowLeft") {
      nowBlock.left -= 1;
      setRender((prev) => renderNode(prev));
    } else if (key === "ArrowRight") {
      nowBlock.left += 1;
      setRender((prev) => renderNode(prev));
    } else if (key === "Control") {
      nowBlock.direction += 1;
      if (nowBlock.direction > 3) {
        nowBlock.direction = 0;
      }
      setRender((prev) => renderNode(prev));
    }
  };
  const [render, setRender] = useState<number[]>(renderNode([]));
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [render]);

  useEffect(() => {
    setInterval(() => {
      if (nowBlock.top === 18) {
        nowBlock.top = -3;
        setRender((prev) => renderNode(prev));
      }
      nowBlock.top += 1;
      setRender((prev) => renderNode(prev));
    }, 1000);
  }, []);

  return <TetrisWrapper>{Init()}</TetrisWrapper>;
};

export default TetrisBoard;
