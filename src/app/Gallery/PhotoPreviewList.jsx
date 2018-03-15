import React, { Fragment } from "react";

import { size, map } from "lodash";

import styles from "./PhotoPreviewList.module.css";

const PhotoPreviewList = props => {
  const { value, openPhoto } = props;
  return (
    <Fragment>
      {size(value) > 0 && (
        <div className={styles.containerPhoto}>
          {map(value, (arPhoto, index) => {
            return (
              <div
                className={styles.previewPhoto}
                style={{ backgroundImage: `url(${arPhoto.preview})` }}
                onClick={() => openPhoto(index)}
                key={arPhoto.value}
              />
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

export default PhotoPreviewList;
