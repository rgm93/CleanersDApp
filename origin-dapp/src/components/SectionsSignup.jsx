import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import sectionsPageStyle from "utils/material-kit-pro-react/views/sectionsPageStyle.jsx";
import SignupPage from "./SignupPage.jsx";

class SectionsSignup extends React.Component {
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className="cd-section" {...rest}>
        <SignupPage />
      </div>
    );
  }
}

export default withStyles(sectionsPageStyle)(SectionsSignup);
