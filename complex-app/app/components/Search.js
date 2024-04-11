import React, { useContext, useEffect } from "react";
import DispatchContext from "./DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";

function Search() {
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });
  const appDispatch = useContext(DispatchContext);
  useEffect(() => {
    document.addEventListener("keyup", escapeSearch);
    return () => {
      document.removeEventListener("keyup", escapeSearch);
    };
  }, []);
  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 750);
      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);
  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResult() {
        try {
          const response = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToken: ourRequest.token }
          );
          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });

          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchResult();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.requestCount]);

  function escapeSearch(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" });
    }
  }
  function handleClose() {
    appDispatch({ type: "closeSearch", value: "" });
  }
  function handleInput(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  }
  return (
    <>
      <div className="search-overlay">
        <div className="search-overlay-top shadow-sm">
          <div className="container container--narrow">
            <label htmlFor="live-search-field" className="search-overlay-icon">
              <i className="fas fa-search"></i>
            </label>
            <input
              autoFocus
              type="text"
              autoComplete="off"
              id="live-search-field"
              className="live-search-field"
              placeholder="What are you interested in?"
              onChange={handleInput}
            />
            <span className="close-live-search" onClick={handleClose}>
              <i className="fas fa-times-circle"></i>
            </span>
          </div>
        </div>

        <div className="search-overlay-bottom">
          <div className="container container--narrow py-3">
            <div
              className={
                "circle-loader " +
                (state.show == "loading" ? "circle-loader--visible" : "")
              }
            ></div>
            <div
              className={
                "live-search-results" +
                (state.show == "results" ? "live-search-results--visible" : "")
              }
            >
              {Boolean(state.results.length) && (
                <div className="list-group shadow-sm">
                  <div className="list-group-item active">
                    <strong>Search Results</strong> ({state.results.length}{" "}
                    {state.results.length > 1 ? "items " : "item "}
                    found)
                  </div>
                  {state.results.map((posts) => {
                    const date = new Date(posts.createdDate);
                    const formattedDate = `${
                      date.getMonth() + 1
                    }/${date.getDate()}/${date.getFullYear()}`;
                    return (
                      <Link
                        key={posts._id}
                        to={`/post/${posts._id}`}
                        className="list-group-item list-group-item-action"
                        onClick={handleClose}
                      >
                        <img
                          className="avatar-tiny"
                          src={posts.author.avatar}
                        />{" "}
                        <strong>{posts.title}</strong>{" "}
                        <span className="text-muted small">
                          by {posts.author.username}on {formattedDate}{" "}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
              {!Boolean(state.results.length) && (
                <p className="alert alert-danger text-center shadow-sm">
                  Sorry, we could not find any search results.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
