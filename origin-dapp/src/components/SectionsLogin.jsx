import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import LoginPage from "./LoginPage.jsx";
import Header from "components/Header.jsx"
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Button from "components/CustomButtons/Button.jsx";
import sectionsPageStyle from "utils/material-kit-pro-react/views/sectionsPageStyle.jsx";

class SectionsLogin extends React.Component {
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className="cd-section" {...rest}>
        <LoginPage />
      </div>
    );
  }
}

export default withStyles(sectionsPageStyle)(SectionsLogin);
