import React, { useContext, useState } from "react";
import Textarea from "react-textarea-autosize";
import "../sass/Button.scss";
import { DataContext } from "../context/store";

const Button = ({ id, list }) => {
    const { cardAdd, listAdd } = useContext(DataContext)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const openForm = () => setOpen(true)
    const closeForm = () =>   setOpen(false)
    const handleChange = (e) => setText(e.target.value)
    const addCard = () => {
        if(text){
            cardAdd(id, text)
        }
        setText("")
    }
    const addList = () => {
      if (text) {
        listAdd(text);
      }
      setText("");
    };
    const showForm = () => {
    const textButton = list ? "add list" : "add card";
    const placeholder = list ? "Enter list title" : "Enter card title";
       return (
            <div className="form-box">
                <Textarea className="text-area" placeholder={placeholder} autoFocus onBlur={closeForm} value={text} onChange={handleChange}/>
                <button className="add" onMouseDown={list ? addList : addCard}>{textButton}</button>
                <button className="close">
                    <div onClick={closeForm}>
                        X
                    </div>
                </button>
            </div>
        ) 
    }
    const showButton = () => {
        const textButton = list ? "add another list" : "add new card"
        const opacityButton = list ? 1 : 0.5
        const colorButton = list ? "#fff" : "inherit"
        const bacgkroundButton = list ? "rgba(0,0,0,0.25)": "inherit"
        return (
            <div
                className="add-button"
                onClick={openForm}
                style={{
                    opacity: opacityButton,
                    backgroundColor: bacgkroundButton,
                    color: colorButton,
                    cursor: list? "pointer" : "default"
                }}
            >
              + {textButton}
            </div>
        )
    }
    return open ? showForm() : showButton()
}

export default Button;