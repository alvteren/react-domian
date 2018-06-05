const excludeValidationProps = ["can", "edited"];

export const rules = {
  excludeValidationProps,
  rules: {
    remindInterval(val, form) {
      const { date } = form;
      const isValid = new Date(val) - new Date(date) < 0;
      if (isValid) return true;
      return { message: "Напоминание о событии должно быть раньше события " }
    }
  }
};
