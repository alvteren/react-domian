import React, { Fragment } from "react";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./gallery.css";

import styles from "./PhotoBig.module.css";

import { Backdrop, Portal, Hidden } from "material-ui";

import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";

const PhotoBig = props => {
  const { index, items, hidePhoto } = props;
  const renderImage = item => {
    const { original } = item;
    return (
      <Fragment>
        <Backdrop open={true} onClick={hidePhoto} />
        <div className={styles.imgContainer}>
          <img src={original} alt="" />
        </div>
      </Fragment>
    );
  };
  return (
    <Fragment>
      {index != null &&
        items && (
          <Portal>
            <div className={styles.container}>
              <div className={styles.imageGallery}>
                <IconButton
                  size="large"
                  className={styles.closeButton}
                  color="inherit"
                  onClick={hidePhoto}
                  aria-label="Close"
                >
                  <CloseIcon />
                </IconButton>
                <Hidden only={["xs", "sm"]}>
                  <ImageGallery
                    items={items}
                    lazyLoad={true}
                    showIndex={true}
                    startIndex={index}
                    renderItem={renderImage}
                    showPlayButton={false}
                  />
                </Hidden>
                <Hidden only={["md", "lg"]}>
                  <ImageGallery
                    items={items}
                    lazyLoad={true}
                    showIndex={true}
                    startIndex={index}
                    renderItem={renderImage}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    showNav={false}
                    showBullets={true}
                  />
                </Hidden>
              </div>
            </div>
          </Portal>
        )}
    </Fragment>
  );
};

// export default connect(mapToStateProps, mapDispatchToProps)(PhotoBig);
export default PhotoBig;
