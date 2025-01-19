import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import "../sass/Board.scss";
import BoardTitle from "./BoardTitle";
import menu from "../assets/menu.svg";
import Card from "./Card";
import Button from "./Button";
import { DataContext } from "../context/store";

const Board = ({ data, index }) => {
  const { moveCard, moveBoard } = useContext(DataContext);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOARD",
    item: { type: "BOARD", id: data.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ["BOARD", "CARD"],
      hover: (item, monitor) => {
        if (!ref.current) {
          return;
        }

        const dragIndex = item.index;
        const hoverIndex = index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // If it's a board being dragged
        if (item.type === "BOARD") {
          moveBoard(dragIndex, hoverIndex);
          item.index = hoverIndex;
        }
      },
      drop: (item, monitor) => {
        // Handle card drops
        if (item.type === "CARD" && item.sourceListId !== data.id) {
          moveCard(
            item.id,
            item.sourceListId,
            data.id,
            item.index,
            data.cards.length
          );
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [index, moveBoard]
  );

  // Initialize drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`board ${isDragging ? "dragging" : ""} ${
        isOver ? "over" : ""
      }`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <div className="board__title">
        <BoardTitle id={data.id} title={data.title} />
        <div className="menu">
          <img src={menu} alt="menu" />
        </div>
      </div>
      <div>
        {data.cards.map((card, cardIndex) => (
          <Card key={card.id} listId={data.id} item={card} index={cardIndex} />
        ))}
      </div>
      <Button id={data.id} />
    </div>
  );
};

export default Board;
