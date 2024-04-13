import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import StateContext from "./StateContext";
import { useParams, NavLink, Route, Routes } from "react-router-dom";
import Axios from "axios";
import ProfilePosts from "./ProfilePosts";
import { useImmer } from "use-immer";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";

function Profile() {
  const appState = useContext(StateContext);
  const { username } = useParams();

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: {
        postCount: "",
        followerCount: "",
        followingCount: "",
      },
    },
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    try {
      async function fetchData() {
        const response = await Axios.post(`/profile/${username}`, {
          token: appState.user.token,
        });
        setState((draft) => {
          draft.profileData = response.data;
        });
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    } catch (error) {
      console.log(error.response.data);
    }
  }, [username]);
  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      try {
        async function fetchData() {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            }
          );
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        }
        fetchData();
        return () => {
          ourRequest.cancel();
        };
      } catch (error) {
        console.log(error.response.data);
      }
    }
  }, [state.startFollowingRequestCount]);
  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      try {
        async function fetchData() {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            }
          );
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        }
        fetchData();
        return () => {
          ourRequest.cancel();
        };
      } catch (error) {
        console.log(error.response.data);
      }
    }
  }, [state.stopFollowingRequestCount]);
  function startFollowing() {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  }
  function stopFollowing() {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  }

  return (
    <Page title="User Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {state.profileData.profileUsername}

        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "" && (
            <button
              className="btn btn-primary btn-sm ml-2"
              onClick={startFollowing}
              disabled={state.followActionLoading}
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}

        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "" && (
            <button
              className="btn btn-danger btn-sm ml-2"
              onClick={stopFollowing}
              disabled={state.followActionLoading}
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Routes>
        <Route path="" element={<ProfilePosts />} />
        <Route path="followers" element={<ProfileFollowers />} />
        <Route path="following" element={<ProfileFollowing />} />
      </Routes>
    </Page>
  );
}

export default Profile;
