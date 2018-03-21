import React, { Fragment } from "react";
import styles from "./Image.module.css";
import Dropzone from "react-dropzone";

import { Hidden, Button } from "material-ui";
import AddAPhotoIcon from "material-ui-icons/AddAPhoto";

const Image = props => {
  const { id, onChangeFile, onImageDrop } = props;
  return (
    <Fragment>
      <Hidden only={["xs", "sm"]}>
        <Dropzone
          className={styles.dropZone}
          activeClassName={styles.dropZoneActive}
          acceptClassName={styles.dropZoneAccept}
          rejectClassName={styles.dropZoneReject}
          multiple={true}
          accept="image/*"
          onDrop={onImageDrop}
        >
          Перетащите один или несколько файлов в эту область{" "}
          <span className={styles.link}>или выберите файл на компьютере</span>
        </Dropzone>
      </Hidden>
      <Hidden only={["md", "lg"]}>
        <label className={styles.labelFile}>
          <input
            className={styles.inputFile}
            name={id}
            type="file"
            id={id}
            multiple
            onChange={onChangeFile}
          />
          <Button variant="raised" color="primary" component="span">
            Добавить фото
            <AddAPhotoIcon className={styles.iconButton} />
          </Button>
        </label>
      </Hidden>
    </Fragment>
  );
};
export default Image;
