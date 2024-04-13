import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "./Page";
import DispatchContext from "./DispatchContext";

function Post(props) {
  const appDispatch = useContext(DispatchContext);
  const posts = props.posts;
  const date = new Date(posts.createdDate);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Link
      to={`/post/${posts._id}`}
      className="list-group-item list-group-item-action"
      onClick={() => {
        appDispatch({ type: "closeSearch", value: "" });
      }}
    >
      <img className="avatar-tiny" src={posts.author.avatar} />{" "}
      <strong>{posts.title}</strong>{" "}
      <span className="text-muted small">
        {!props.noAuthor && <>by {posts.author.username}</>} on {formattedDate}{" "}
      </span>
    </Link>
  );
}

export default Post;
