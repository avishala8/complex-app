import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingDots from "./LoadingDotsIcon";
import Post from "./Post";
import NotFound from "./NotFound";

function ProfilePosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState();
  const { username } = useParams();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token,
        });
        if (!response.data) {
          return <NotFound />;
        }
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDots />;
  return (
    <div className="list-group">
      {posts.map((posts) => {
        return <Post posts={posts} key={posts._id} noAuthor={true} />;
      })}
    </div>
  );
}

export default ProfilePosts;
