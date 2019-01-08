import React from "react";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle.jsx";

class GridVideo extends React.Component {
     render() {
          const { classes } = this.props;
          return (
               <GridItem xs={12} sm={12} md={5} className={classes.mlAuto}>
                    <div className={classes.iframeContainer} style={{ marginTop: "50px" }}>
                         <iframe
                              height="250"
                              src="https://www.youtube.com/embed/${dpw9EHDh2bMi}"
                              frameBorder="0"
                              allow="encrypted-media"
                              allowFullScreen=""
                              title="Tesla"
                         />
                    </div>
               </GridItem>
          );
     }
}

export default withStyles(headersStyle)(GridVideo);