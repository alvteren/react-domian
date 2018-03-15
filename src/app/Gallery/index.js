import React, { Fragment } from "react";
import { toArray } from "lodash";
import PhotoBig from "./PhotoBig";
import PhotoPreviewList from "./PhotoPreviewList";

class Gallery extends React.Component {
  state = {
    currentSlide: null
  };
  setSlide = index => {
    this.setState({ currentSlide: index });
  };
  closeGallery = () => {
    this.setState({ currentSlide: null });
  };
  openGallery = index => {
    this.setState({ currentSlide: index != null ? index : 0 });
  };

  render() {
    const { slides } = this.props;
    const arSlides = slides && toArray(slides);
    const { currentSlide } = this.state;
    const items =
      arSlides &&
      arSlides.map(arPhoto => {
        return { original: arPhoto.src, thumbnail: arPhoto.preview };
      });

    return (
      <Fragment>
        <PhotoPreviewList value={arSlides} openPhoto={this.openGallery} />
        {currentSlide != null && (
          <PhotoBig
            index={currentSlide}
            items={items}
            hidePhoto={this.closeGallery}
          />
        )}
      </Fragment>
    );
  }
}

export default Gallery;
