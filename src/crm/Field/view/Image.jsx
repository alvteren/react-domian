import React from "react";

import Gallery from "../../../app/Gallery";

const Image = props => {
  const { value } = props;
  return <Gallery slides={value} />;
};
export default Image;
