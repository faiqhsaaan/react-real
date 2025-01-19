import React, { createContext, useState } from "react";
import { v4 as uuid } from "uuid";

const cards = [
  {
    id: "card-1",
    title: "Learning how to code",
  },
  {
    id: "card-2",
    title: "how to code",
  },
  {
    id: "card-3",
    title: "code",
  },
];

const initialState = {
  lists: {
    "list-1": {
      id: "list-1",
      title: "Backlog",
      cards: cards,
    },
    "list-2": {
      id: "list-2",
      title: "On Progress",
      cards: [],
    },
  },
  listIds: ["list-1", "list-2"],
};

export const DataContext = createContext();

export const DataProvider = (props) => {
  const [store, setStore] = useState(initialState);

  // Existing functions
  const changeTitle = (id, text) => {
    const item = store.lists[id];
    item.title = text;
    const newStore = {
      ...store,
      lists: {
        ...store.lists,
        [id]: item,
      },
    };
    setStore(newStore);
  };

  const cardDelete = (listId, cardId) => {
    const item = store.lists[listId];
    const removeCard = item.cards.filter((card) => card.id !== cardId);
    item.cards = removeCard;
    const newStore = {
      ...store,
      lists: {
        ...store.lists,
        [listId]: item,
      },
    };
    setStore(newStore);
  };

  const cardAdd = (listId, text) => {
    const item = store.lists[listId];
    const id = uuid();
    const newCard = {
      id: `card-${id}`,
      title: text,
    };
    item.cards = [...item.cards, newCard];
    const newStore = {
      ...store,
      lists: {
        ...store.lists,
        [listId]: item,
      },
    };
    setStore(newStore);
  };

  const cardEdit = (listId, cardId, idx, text) => {
    const item = store.lists[listId];
    const card = item.cards.find((item) => item.id === cardId);
    card.title = text;
    item.cards.splice(idx, 1, card);
    const newStore = {
      ...store,
      lists: {
        ...store.lists,
        [listId]: item,
      },
    };
    setStore(newStore);
  };

  const listAdd = (text) => {
    const id = `list-${uuid()}`;
    const newList = {
      id,
      title: text,
      cards: [],
    };
    const newStore = {
      listIds: [...store.listIds, id],
      lists: {
        ...store.lists,
        [id]: newList,
      },
    };
    setStore(newStore);
  };

  // New functions for drag and drop
  const moveCard = (
    cardId,
    sourceListId,
    targetListId,
    sourceIndex,
    targetIndex
  ) => {
    setStore((prev) => {
      // Create deep copies to avoid mutating state directly
      const newStore = {
        ...prev,
        lists: { ...prev.lists },
      };

      const sourceList = {
        ...newStore.lists[sourceListId],
        cards: [...newStore.lists[sourceListId].cards],
      };
      const targetList =
        sourceListId === targetListId
          ? sourceList
          : {
              ...newStore.lists[targetListId],
              cards: [...newStore.lists[targetListId].cards],
            };

      // Remove card from source list
      const [movedCard] = sourceList.cards.splice(sourceIndex, 1);

      // Add card to target list
      targetList.cards.splice(targetIndex, 0, movedCard);

      newStore.lists[sourceListId] = sourceList;
      if (sourceListId !== targetListId) {
        newStore.lists[targetListId] = targetList;
      }

      return newStore;
    });
  };

  const moveBoard = (dragIndex, hoverIndex) => {
    setStore((prev) => {
      const newListIds = [...prev.listIds];
      const [removedId] = newListIds.splice(dragIndex, 1);
      newListIds.splice(hoverIndex, 0, removedId);

      return {
        ...prev,
        listIds: newListIds,
      };
    });
  };

  return (
    <DataContext.Provider
      value={{
        store,
        changeTitle,
        cardDelete,
        cardEdit,
        cardAdd,
        listAdd,
        moveCard,
        moveBoard,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
