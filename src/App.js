import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import Crosschaineth from './components/crosschaineth';
import Crosschaintoken from './components/crosschaintoken';

export default function App() {
  return (
      <Routes>
        <Route path="/"></Route>
        <Route path="/crosschaineth" element={
          <Crosschaineth />
        } exact />
        <Route path="/crosschaintoken" element={
          <Crosschaintoken />
        } exact />
      </Routes>
  );
}