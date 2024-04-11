import React, { useEffect } from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Page title="Not Found">
      <h2 className="text-center">Whoops,we cannot find this page.</h2>
      <p className="lead text-muted text-center">
        You can alyaws visit the <Link to={"/"}>homepage</Link> to give youself
        a fresh start.
      </p>
    </Page>
  );
}

export default NotFound;
