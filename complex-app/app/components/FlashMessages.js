import React, { useContext, useEffect } from "react";
import StateContext from "./StateContext";

function FlashMessages(props) {
  const appState = useContext(StateContext);
  return (
    <div className="floating-alerts">
      {props.message.map((msg, index) => {
        return (
          <div
            key={index}
            className={
              "alert text-center floating-alert shadow-sm" +
              (appState.loggedIn ? " alert-success" : " alert-danger")
            }
          >
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessages;
