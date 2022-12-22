import { HashRouter, Routes, Route } from "react-router-dom";
import Tetris from "../Screen/Tetris";

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Tetris />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
