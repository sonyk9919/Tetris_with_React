import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tetris from "../Screen/Tetris";

const Router = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Tetris />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
