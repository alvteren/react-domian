import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import styles from "./Balance.module.css";

const grads = [
  { avito: 1, balance: 0, multiple: 1 },
  { avito: 1.1, balance: 300000, multiple: 1.01 },
  { avito: 1.2, balance: 500000, multiple: 1.02 },
  { avito: 1.3, balance: 800000, multiple: 1.03 },
  { avito: 1.4, balance: 1000000, multiple: 1.04 },
  { avito: 1.5, balance: 1300000, multiple: 1.05 },
  { avito: 1.6, balance: 1500000, multiple: 1.06 },
  { avito: 1.7, balance: 1800000, multiple: 1.07 },
  { avito: 1.8, balance: 2000000, multiple: 1.08 },
  { avito: 1.9, balance: 2200000, multiple: 1.09 },
  { avito: 2, balance: 2400000, multiple: 1.1 }
];

const getPercentFill = balance => {
  let percent = 0.0;
  grads.forEach((grad, index) => {
    const prevBalance = index > 0 ? grads[index - 1].balance : 0;
    const currentBalance = grad.balance;
    if (balance >= prevBalance && balance < currentBalance) {
      if (index > 0) {
        percent = (index - 1) / grads.length * 100;
        percent +=
          (balance - prevBalance) /
          (currentBalance - prevBalance) /
          grads.length *
          100;
      }
    }
  });

  return percent;
};

const Balance = props => {
  const { balance } = props;

  const percentFill = getPercentFill(parseFloat(balance));
  return (
    <div className={styles.wrapper}>
      <div className={styles.progressContainer}>
        <div className={styles.progressGraduateTop}>
          {grads.map((grad, index) => {
            const gradPercent = index / grads.length * 100;
            return (
              <div
                key={index}
                style={{ left: `${gradPercent}%` }}
                className={styles.progressGrad}
              >
                {grad.avito}
              </div>
            );
          })}
        </div>
        <div className={styles.progressBg} />
        <div
          className={styles.progressFill}
          style={{ width: `${percentFill}%` }}
        />
        <div className={styles.progressGraduateInner}>
          {grads.map((grad, index) => {
            const gradPercent = index / grads.length * 100;
            return (
              <div
                key={index}
                style={{ left: `${gradPercent}%` }}
                className={styles.progressGrad}
              >
                {parseFloat(grad.balance) / 1000} т.р.
              </div>
            );
          })}
        </div>
        <div className={styles.progressGraduateBottom}>
          {grads.map((grad, index) => {
            const gradPercent = index / grads.length * 100;
            return (
              <div
                key={index}
                style={{ left: `${gradPercent}%` }}
                className={styles.progressGrad}
              >
                {grad.multiple}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;

  return state.aliance.aliances.data[id];
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    onSave: () => {
      // dispatch(addToWish({ objectsId: [params.id], wishId: 0 }));
    }
  };
};
Balance.propTypes = {
  id: PropTypes.string.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(Balance);
