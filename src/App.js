// App.js
import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DataContext } from "./context/store";
import Header from "./components/Header";
import Board from "./components/Board";
import Button from "./components/Button";
import "./sass/App.scss";

const App = () => {
  const { store, moveBoard } = useContext(DataContext);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <Header />
        <div className="container">
          {store.listIds.map((listId, index) => {
            const data = store.lists[listId];
            return <Board key={listId} data={data} index={index} />;
          })}
          <Button list />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
