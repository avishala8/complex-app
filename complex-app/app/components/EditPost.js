import React, { useContext, useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import LoadingDots from "./LoadingDotsIcon";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import NotFound from "./NotFound";

function EditPost() {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        break;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        break;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        break;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        break;
      case "saveStarted":
        draft.isSaving = true;
        break;
      case "saveFinshed":
        draft.isSaving = false;
        break;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must give a Title.";
        }
        break;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must enter Content.";
        }
        break;
      case "notFound":
        draft.notFound = true;
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);
  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  }

  const ourRequest = Axios.CancelToken.source();
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}/`, {
          cancelToken: ourRequest.token,
        });
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          if (appState.user.username != response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You don't have permission to edit this post.",
            });
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound", value: response.data });
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);
  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveStarted" });
      async function fetchPost() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          appDispatch({ type: "flashMessage", value: "Post Updated!" });

          dispatch({ type: "saveFinshed" });
        } catch (error) {
          console.log(error.response.data);
        }
      }
      fetchPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);
  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching) {
    return (
      <Page title="...">
        <LoadingDots />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
      <Link className="medium font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to Post
      </Link>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            value={state.title.value}
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title input-post"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={(e) => {
              dispatch({ type: "titleChange", value: e.target.value });
            }}
            onBlur={(e) => {
              dispatch({ type: "titleRules", value: e.target.value });
            }}
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control input-post"
            type="text"
            onChange={(e) => {
              dispatch({ type: "bodyChange", value: e.target.value });
            }}
            onBlur={(e) => {
              dispatch({ type: "bodyRules", value: e.target.value });
            }}
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primar" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
