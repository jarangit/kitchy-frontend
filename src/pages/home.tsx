import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <div>
      <Link to={"login"}>Login</Link>
    </div>
  );
};

export default HomePage;
