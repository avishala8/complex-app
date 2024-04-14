import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "./Page";
import StateContext from "./StateContext";
import { useImmer } from "use-immer";
import LoadingDots from "./LoadingDotsIcon";
import Axios from "axios";
import Post from "./Post";

function Home() {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    try {
      async function fetchData() {
        const response = await Axios.post("/getHomeFeed", {
          token: appState.user.token,
        });
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    } catch (error) {
      console.log(error.response.data);
    }
  }, []);
  if (state.isLoading) {
    return <LoadingDots />;
  }
  return (
    <Page title="Your Feed">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center">
            Hello{" "}
            <strong>
              {appState.user.username.charAt(0).toUpperCase() +
                appState.user.username.slice(1)}
            </strong>
            , latest posts from those you follow!
          </h2>

          <div className="list-group">
            {state.feed.map((posts) => {
              return <Post posts={posts} key={posts._id} />;
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && (
        <>
          <h2 className="text-center">
            Hello{" "}
            <strong>
              {appState.user.username.charAt(0).toUpperCase() +
                appState.user.username.slice(1)}
            </strong>
            , your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  );
}

export default Home;
