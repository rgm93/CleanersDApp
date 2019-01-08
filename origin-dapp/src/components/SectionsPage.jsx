import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import SectionHeaders from "./SectionHeaders.jsx";
import SectionFeatures from "./SectionFeatures.jsx";

import sectionsPageStyle from "utils/material-kit-pro-react/views/sectionsPageStyle.jsx";

class SectionsPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <SectionHeaders id="landing" />
        <SectionFeatures id="features" />
      </div>
    );
  }
}

export default withStyles(sectionsPageStyle)(SectionsPage);
