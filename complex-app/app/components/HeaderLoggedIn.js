import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import { Tooltip as ReactTooltip } from "react-tooltip";

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: "logout" });
    appDispatch({ type: "flashMessage", value: "Logged Out!" });
  }
  function handleSearch(e) {
    e.preventDefault();
    appDispatch({ type: "openSearch", value: "" });
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <Link
        href="#"
        className="text-white mr-2 header-search-icon"
        onClick={handleSearch}
        data-tooltip-id="search"
        data-tooltip-content={"Search"}
      >
        <i className="fas fa-search"></i>
      </Link>{" "}
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span
        className={
          "mr-2 header-chat-icon " +
          (appState.unreadChatCount ? "text-danger" : "text-white")
        }
        data-tooltip-id="chat"
        data-tooltip-content={"Chat"}
        onClick={() => {
          appDispatch({ type: "toggleChat" });
        }}
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}{" "}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link
        to={`/profile/${appState.user.username}`}
        className="mr-2"
        data-tooltip-id="profile"
        data-tooltip-content={"My Profile"}
      >
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
      <Link to="/create-post" className="btn btn-sm btn-success mr-2">
        Create Post
      </Link>{" "}
      <Link to="/">
        <button onClick={handleLogout} className="btn btn-sm btn-secondary">
          Sign Out
        </button>
      </Link>
    </div>
  );
}

export default HeaderLoggedIn;
