import React, { useEffect, useReducer, useState, Suspense } from "react";
import { useImmerReducer } from "use-immer";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://complex-backend.onrender.com";
// My components
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";
import Terms from "./components/Terms";
import About from "./components/About";
import Home from "./components/Home";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));

// import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import StateContext from "./components/StateContext";
import DispatchContext from "./components/DispatchContext";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
// import Search from "./components/Search";
// import Chat from "./components/Chat";
import LoadingDots from "./components/LoadingDotsIcon";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("appToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("appToken"),
      avatar: localStorage.getItem("appAvatar"),
      username: localStorage.getItem("appUsername"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "increaseChatCount":
        draft.unreadChatCount++;
        return;
      case "clearChatCount":
        draft.unreadChatCount = 0;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("appToken", state.user.token);
      localStorage.setItem("appUsername", state.user.username);
      localStorage.setItem("appAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("appToken");
      localStorage.removeItem("appUsername");
      localStorage.removeItem("appAvatar");
    }
  }, [state.loggedIn]);
  //check if token is expired on first render
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResult() {
        try {
          const response = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            { cancelToken: ourRequest.token }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "The session has expired. Please Login again!",
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
      fetchResult();
      return () => {
        ourRequest.cancel();
      };
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages message={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDots />}>
            <Routes>
              <Route
                path="/"
                element={state.loggedIn ? <Home /> : <HomeGuest />}
              />

              <Route
                path="/about-us"
                element={state.loggedIn ? <About /> : <HomeGuest />}
              />
              <Route
                path="/terms"
                element={state.loggedIn ? <Terms /> : <HomeGuest />}
              />
              <Route
                path="/create-post"
                element={state.loggedIn ? <CreatePost /> : <HomeGuest />}
              />
              <Route
                path="/profile/:username/*"
                element={state.loggedIn ? <Profile /> : <HomeGuest />}
              />
              <Route
                path="/post/:id"
                element={state.loggedIn ? <ViewSinglePost /> : <HomeGuest />}
              />
              <Route
                path="/post/:id/edit"
                element={state.loggedIn ? <EditPost /> : <HomeGuest />}
              />
              <Route
                path="*"
                element={state.loggedIn ? <NotFound /> : <HomeGuest />}
              />
            </Routes>
          </Suspense>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);
if (module.hot) {
  module.hot.accept();
}
