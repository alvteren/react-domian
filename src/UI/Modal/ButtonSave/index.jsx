import React from "react";
import Button from "material-ui/Button";
import styles from "./ButtonSave.module.css";

class ButtonSave extends React.PureComponent {
  render() {
    return (
      <Button
        variant="raised"
        color="secondary"
        onClick={this.props.onClick}
        className={styles.buttonSave}
      >
        {this.props.children ? this.props.children : "Сохранить"}
      </Button>
    );
  }
}

export default ButtonSave;
