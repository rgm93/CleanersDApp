import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import headersStyle from "utils/material-kit-pro-react/views/sectionsSections/headersStyle.jsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import HeaderLanding from "components/HeaderLanding.jsx";
import Button from "components/CustomButtons/Button.jsx";

class MyHeader extends React.Component {
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className="cd-section" {...rest}>
        <HeaderLanding
          absolute
          color="transparent"
          links={
            <div className={classes.collapse}>
              <List className={classes.list + " " + classes.mlAuto}>
                <ListItem className={classes.listItem}>
                  <Button
                    href="/#/signup"
                    className={classes.navLink}
                    color="transparent"
                    data-number="1"
                  >
                    Darse de Alta
                    </Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <Button
                    href="/#/login"
                    className={classes.navLink}
                    color="transparent"
                    data-number="2"
                  >
                    Acceder
                    </Button>
                </ListItem>
              </List>
            </div>
          }
        />
      </div>
    )
  }
}

export default withStyles(headersStyle)(MyHeader);