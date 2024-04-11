import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import LoadingDots from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import { Tooltip as ReactTooltip } from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

function ViewSinglePost() {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);
  const ourRequest = Axios.CancelToken.source();
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}/`, {
          cancelToken: ourRequest.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDots />
      </Page>
    );
  }
  const date = new Date(post.createdDate);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    } else return false;
  }
  async function deleteHandler() {
    const confirm = window.confirm("Do you really want to delete this post?");
    if (confirm) {
      try {
        await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        })
          .then(
            appDispatch({
              type: "flashMessage",
              value: "Post Deleted Successfully!",
            })
          )
          .then(navigate(`/profile/${appState.user.username}`));
      } catch (error) {
        console.log(error.response.data);
      }
    }
  }
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              className="text-primary mr-2"
              data-tooltip-id="edit"
              data-tooltip-content="Edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />

            <Link
              className="delete-post-button text-danger"
              data-tooltip-id="delete"
              data-tooltip-content="Delete"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </Link>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}{" "}
        </Link>{" "}
        on {formattedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  );
}

export default ViewSinglePost;
