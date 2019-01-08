import React from "react";
// react component for creating beautiful carousel
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// core components
import HeaderLanding from "components/HeaderLanding.jsx";
import Button from "components/Button.jsx";
import GridContainer from "components/GridContainer.jsx";
import GridItem from "components/GridItem.jsx";

import headersStyle from "utils/material-kit-pro-react/views/sectionsSections/headersStyle.jsx";

import chekinlanding from "../assets/img/chekinlanding.png";

class SectionHeaders extends React.Component {
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
        <div
          className={classes.pageHeader}
          style={{ backgroundImage: `url("${chekinlanding}")` }}
        >

          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={6} md={8} style={{
                "@media(maxHeight: 960px)": {
                  marginTop: "100px",
                },
              }}>
                <h1 className={classes.GridItem} style={{
                  "@media(maxHeight: 640px)": {
                    marginTop: "100px",
                  },
                  marginTop: "50px",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 50,
                  marginBottom: "0.5rem",
                  lineHeight: "1.2",
                }}>Gestiona tus servicios<br />de limpieza<br /></h1>
                <Button
                    color="danger"
                    size="lg"
                    href="/#/publicar-oferta"
                    rel=""
                    style={{marginTop: "20px"}}
                  >
                    <i className="fas fa-ticket-alt"/>
                    <a style={{marginLeft: "5px", color: "#FFFFFF"}}>RESERVA ONLINE</a> 
                  </Button>
              </GridItem>
              
              <GridItem xs={12} sm={6} md={4} className={classes.GridItem} style={{marginTop: "60px"}}>
                <h4 style={{
                  "@media(minHeight: 960px)": {
                    marginTop: "100px",
                  },
                }}>
                  Encuentra, contacta y conecta de una forma fácil y rápida con las empresas de limpieza cercanas a ti
                </h4>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(headersStyle)(SectionHeaders);