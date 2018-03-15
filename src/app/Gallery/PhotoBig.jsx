import React, { Fragment } from "react";
import { connect } from "react-redux";
import { deletePhoto } from "../actions/photo";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./gallery.css";

import styles from "./PhotoBig.module.css";

import { Backdrop, Portal, Hidden } from "material-ui";

import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import DeleteIcon from "material-ui-icons/DeleteForever";

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

  let _imageGallery;

  const onClickDelete = () => {
    props.deletePhoto(_imageGallery.getCurrentIndex());
  };

  return (
    <Fragment>
      {index != null &&
        items && (
          <Portal>
            <div className={styles.container} data-exclude-swipe={true}>
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
                <IconButton
                  size="large"
                  className={styles.deleteButton}
                  color="inherit"
                  onClick={onClickDelete}
                  aria-label="Close"
                >
                  <DeleteIcon />
                </IconButton>
                <Hidden only={["xs", "sm"]}>
                  <ImageGallery
                    items={items}
                    lazyLoad={true}
                    showIndex={true}
                    startIndex={index}
                    renderItem={renderImage}
                    showPlayButton={false}
                    ref={i => (_imageGallery = i)}
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
                    ref={i => (_imageGallery = i)}
                  />
                </Hidden>
              </div>
            </div>
          </Portal>
        )}
    </Fragment>
  );
};

const mapToStateProps = state => {
  const { current } = state.crm.objects;

  return { current };
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { current } = stateProps;
  return {
    ...stateProps,
    ...ownProps,
    deletePhoto: index => {
      dispatch(deletePhoto({ id: "objects", index, elementId: current }));
    }
  };
};

export default connect(mapToStateProps, null, mergeProps)(PhotoBig);
// export default PhotoBig;
