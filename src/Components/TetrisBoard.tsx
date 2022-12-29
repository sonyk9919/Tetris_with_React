import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "./Button/GameButton";
import { FullScreen } from "./Modal/FullScreen";

const Wrapper = styled.div`
  width: 500px;
  height: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border: 5px solid purple;
  box-shadow: 20px 40px 100px black;
  background-color: white;
`;

const Score = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
  padding: 1rem 0;
  width: 100%;
  font-size: 36px;
  font-weight: 1000;
  text-align: center;
  border: 5px solid purple;
  font-family: "Roboto", sans-serif;
`;

const TetrisWrapper = styled.div`
  width: 100%;
  height: 1000px;
  border: 5px solid purple;

  display: grid;
  grid-template-columns: repeat(10, 1fr);
  .tree {
    background-color: #71e471;
  }
  .box {
    background-color: #f7f766;
  }
  .pipe {
    background-color: #8f8ffd;
  }
  .leftHook {
    background-color: #ff9494;
  }
  .rightHook {
    background-color: #7df1f1;
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
  box: [
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],

    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],

    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],

    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ],
  pipe: [
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  ],
  rightHook: [
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [0, 2],
    ],
  ],
  leftHook: [
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  ],
};

interface INowBlock {
  type: "tree" | "box" | "pipe" | "leftHook" | "rightHook";
  direction: number;
  top: number;
  left: number;
}

type ITypeAndNumber = { type: string; Number: number };
interface ITetrisMap {
  map: ITypeAndNumber[];
}

const savedMap: ITetrisMap = {
  map: [],
};

interface IProps {
  gameStart: boolean;
  audioElement: HTMLAudioElement;
}

const TetrisBoard = ({ gameStart, audioElement }: IProps) => {
  const getRandomBlock = () => {
    const block = [
      "tree" as const,
      "box" as const,
      "pipe" as const,
      "leftHook" as const,
      "rightHook" as const,
    ];
    return block[Math.floor(Math.random() * block.length)];
  };
  const nowBlock = useRef<INowBlock>({
    type: getRandomBlock(),
    direction: 0,
    top: 0,
    left: 4,
  });

  const isContact = useCallback(
    (render: number[]) => {
      for (let i = 0; i < savedMap.map.length; i++) {
        if (render.find((item) => item === savedMap.map[i].Number)) {
          return true;
        }
      }

      if (render.find((item) => Math.floor(item / 10) > 19)) {
        console.log(render);
        return true;
      }

      return false;
    },
    [nowBlock]
  );

  const isActive = useCallback(
    (render: number[], prev: number[]) => {
      let count = 0;
      let minus = 0;

      for (let i = 0; i < prev.length; i++) {
        for (let j = 0; j < render.length; j++) {
          minus = render[i] - prev[i];
          if (minus === -1 || minus === 9) {
            count -= 1;
          } else if (minus === 1 || minus === 11) {
            count += 1;
          }
        }
      }

      if (count === -16) {
        if (isContact(render)) {
          nowBlock.current.left += 1;
          if (minus === 9) {
            nowBlock.current.top -= 1;
          }
          return false;
        }
      } else if (count === 16) {
        if (isContact(render)) {
          nowBlock.current.left -= 1;
          if (minus === 1) {
            nowBlock.current.top -= 1;
          }
          return false;
        }
      }

      const preRightCheck = prev.find((item) => item % 10 === 9);
      const nowRightCheck = render.find((item) => item % 10 === 0);

      if (preRightCheck && nowRightCheck) {
        nowBlock.current.left -= 1;
        return false;
      }

      const preLeftCheck = prev.find((item) => item % 10 === 0);
      const nowLeftCheck = render.find((item) => item % 10 === 9);

      if (preLeftCheck && nowLeftCheck) {
        nowBlock.current.left += 1;
        return false;
      }

      if (onChange.current) {
        if (
          render.find((item) => item % 10 === 0) &&
          render.find((item) => item % 10 === 9)
        ) {
          nowBlock.current.direction -= 1;
          if (nowBlock.current.direction < 0) {
            nowBlock.current.direction = 0;
          }
          return false;
        }
      }

      if (onChange.current) {
        onChange.current = false;
        for (let i = 0; i < savedMap.map.length; i++) {
          if (render.find((item) => item === savedMap.map[i].Number)) {
            nowBlock.current.direction -= 1;
            if (nowBlock.current.direction < 0) {
              nowBlock.current.direction = 0;
            }
            return false;
          }
        }
      }

      return true;
    },
    [nowBlock, isContact]
  );

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const removeFloor = useCallback(() => {
    const floor = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < savedMap.map.length; i++) {
      if (Math.floor(savedMap.map[i].Number / 10) <= 19) {
        floor[Math.floor(savedMap.map[i].Number / 10)] += 1;
      }
    }
    const complate: number[] = [];

    for (let i = 0; i < floor.length; i++) {
      if (floor[i] >= 10) {
        complate.push(i);
      }
    }

    if (complate.length === 0) {
      return;
    }

    let tempMap: ITetrisMap = savedMap;

    for (let i = 0; i < complate.length; i++) {
      tempMap.map = tempMap.map.filter(
        (item) => Math.floor(item.Number / 10) !== complate[i]
      );
    }

    for (let i = 0; i < tempMap.map.length; i++) {
      if (
        Math.floor(tempMap.map[i].Number / 10) < complate[complate.length - 1]
      ) {
        tempMap.map[i].Number += 10 * complate.length;
      }
    }

    if (complate.length > 0) {
      setScore((prev) => prev + complate.length);
    }

    savedMap.map = tempMap.map;
    return;
  }, [setScore]);

  const renderNode = useCallback(
    (prev: number[]): number[] => {
      if (!gamePlay.current) {
        return [];
      }
      const blocks =
        initialBlock[nowBlock.current.type][nowBlock.current.direction];
      const render = blocks.map((block) => {
        const x = block[0] + nowBlock.current.top;
        const y = block[1] + nowBlock.current.left;
        return x * 10 + y;
      });

      if (!isActive(render, prev)) {
        return prev;
      }

      if (isContact(render)) {
        const contactMap = render.map((item) => {
          const addMap: ITypeAndNumber = {
            type: nowBlock.current.type,
            Number: item - 10,
          };
          return addMap;
        });

        for (let i = 0; i < contactMap.length; i++) {
          if (contactMap[i].Number >= 0) {
            savedMap.map.push(contactMap[i]);
          } else {
            gamePlay.current = false;
            setGameOver((prev) => true);
          }
        }
        removeFloor();
        nowBlock.current = {
          type: getRandomBlock(),
          direction: 0,
          top: -4,
          left: 4,
        };
        return renderNode([]);
      }
      return render;
    },
    [removeFloor, setGameOver, isActive, isContact]
  );

  const returnClassName = (render: number[], value: number) => {
    if (render.find((item) => item === value) !== undefined) {
      return nowBlock.current.type;
    }

    for (let i = 0; i < savedMap.map.length; i++) {
      if (savedMap.map[i].Number === value) {
        return savedMap.map[i].type;
      }
    }
    return "";
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
          className={returnClassName(render, item2)}
        ></TetrisBlock>
      ))
    );
  };

  const [render, setRender] = useState<number[]>([]);
  const gamePlay = useRef(false);
  const onChange = useRef(false);
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;
      if (key === "ArrowLeft") {
        nowBlock.current.left -= 1;
        setRender((prev) => renderNode(prev));
      } else if (key === "ArrowRight") {
        nowBlock.current.left += 1;
        setRender((prev) => renderNode(prev));
      } else if (key === "Control") {
        onChange.current = true;
        nowBlock.current.direction += 1;
        if (nowBlock.current.direction > 3) {
          nowBlock.current.direction = 0;
        }
        setRender((prev) => renderNode(prev));
      } else if (key === " ") {
        setTimeout(() => {
          nowBlock.current.top += 1;
        }, 0);
        setRender((prev) => renderNode(prev));
      }
    },
    [nowBlock, renderNode]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gamePlay.current) {
        setRender((prev) => renderNode(prev));
        setTimeout(() => {
          nowBlock.current.top += 1;
        }, 0);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [setRender, renderNode]);

  useEffect(() => {
    if (gameStart) {
      gamePlay.current = true;
      audioElement.volume = 0.3;
      audioElement.loop = true;
      audioElement.play();
    }
  }, [gameStart, audioElement]);

  useEffect(() => {
    if (gameOver) {
      audioElement.pause();
    }
  }, [gameOver, audioElement]);

  return (
    <>
      {gameOver && (
        <FullScreen>
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            다시하기
          </Button>
        </FullScreen>
      )}
      <Wrapper>
        <Score>Score: {score}</Score>
        <TetrisWrapper>{Init()}</TetrisWrapper>
      </Wrapper>
    </>
  );
};

export default TetrisBoard;
