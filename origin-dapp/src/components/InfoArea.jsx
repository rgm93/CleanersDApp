import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";

import infoStyle from "../utils/material-kit-pro-react/components/infoStyle.jsx";

function InfoArea({ ...props }) {
  const { classes, title, description, iconColor, vertical, className } = props;
  const iconWrapper = classNames({
    [classes.iconWrapper]: true,
    [classes[iconColor]]: true,
    [classes.iconWrapperVertical]: vertical
  });
  const iconClasses = classNames({
    [classes.icon]: true,
    [classes.iconVertical]: vertical
  });
  const infoAreaClasses = classNames({
    [classes.infoArea]: true,
    [className]: className !== undefined
  });
  let icon = null;
  switch (typeof props.icon) {
    case "string":
      icon = <Icon className={iconClasses}>{props.icon}</Icon>;
      break;
    default:
      icon = <props.icon className={iconClasses} />;
      break;
  }
  return (
    <div className={infoAreaClasses}>
      <div className={iconWrapper}>{icon}</div>
      <div className={classes.descriptionWrapper}>
        <h4 className={classes.title} style={{
          marginTop: "50px",
          fontFamily: "inherit",
          fontWeight: 600,
          fontSize: 20,
          marginBottom: "0.5rem",
          lineHeight: "1.2",
        }}>{title}</h4>
        <div className={classes.description} style={{
          marginTop: "30px",
          fontFamily: "inherit",
          fontWeight: 300,
          fontSize: 18,
          marginBottom: "0.5rem",
          lineHeight: "1.2",
        }}>{description}</div>
      </div>
    </div>
  );
}

InfoArea.defaultProps = {
  iconColor: "gray"
};

InfoArea.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  iconColor: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  vertical: PropTypes.bool,
  className: PropTypes.string
};

export default withStyles(infoStyle)(InfoArea);
