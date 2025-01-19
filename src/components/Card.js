import React, { useContext, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import delIcon from "../assets/delete.svg";
import "../sass/Card.scss";
import { DataContext } from "../context/store";

const Card = ({ listId, item, index }) => {
  const { cardDelete, cardEdit, moveCard } = useContext(DataContext);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(item.title);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: {
      type: "CARD",
      id: item.id,
      index,
      sourceListId: listId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "CARD",
    hover(dragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = dragItem.index;
      const hoverIndex = index;
      const sourceListId = dragItem.sourceListId;
      const targetListId = listId;

      if (dragIndex === hoverIndex && sourceListId === targetListId) return;

      moveCard(dragItem.id, sourceListId, targetListId, dragIndex, hoverIndex);

      dragItem.index = hoverIndex;
      dragItem.sourceListId = targetListId;
    },
  });

  drag(drop(ref));

  const isEdit = () => setEdit(true);
  const handleChange = (e) => setText(e.target.value);
  const closeInput = () => {
    cardEdit(listId, item.id, index, text);
    setEdit(false);
  };
  const deleteCard = () => {
    cardDelete(listId, item.id);
  };

  return (
    <div
      ref={ref}
      className={`card-list ${isDragging ? "dragging" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {edit ? (
        <form onSubmit={closeInput}>
          <input
            autoFocus
            type="text"
            onBlur={closeInput}
            value={text}
            onChange={handleChange}
          />
        </form>
      ) : (
        <div className="card-list__text">
          <p onClick={isEdit}>{item.title}</p>
          <img src={delIcon} alt="delete" onClick={deleteCard} />
        </div>
      )}
    </div>
  );
};

export default Card;
