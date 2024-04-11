import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import StateContext from "./StateContext";
import { useParams } from "react-router-dom";
import Axios from "axios";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const appState = useContext(StateContext);
  const { username } = useParams();

  const [profileData, setProfileData] = useState({
    profileUsername: "",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: {
      postCount: "",
      followerCount: "",
      followingCount: "",
    },
  });

  useEffect(() => {
    try {
      async function fetchData() {
        const response = await Axios.post(`/profile/${username}`, {
          token: appState.user.token,
        });
        setProfileData(response.data);
      }
      fetchData();
    } catch (error) {
      console.log(error.response.data);
    }
  }, []);

  return (
    <Page title="User Profile">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />
        {profileData.profileUsername}

        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
}

export default Profile;
