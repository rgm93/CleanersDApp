import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import featuresStyle from "utils/material-kit-pro-react/views/sectionsSections/featuresStyle.jsx";

import Wallet from "@material-ui/icons/Payment"
import Check from "@material-ui/icons/Check"
import Settings from "@material-ui/icons/Settings"

import GridContainer from "components/GridContainer.jsx";
import GridItem from "components/GridItem.jsx";
import InfoArea from "components/InfoArea.jsx";
import Button from "components/Button.jsx";

function SectionFeatures({ ...props }) {
  const { classes, ...rest } = props;
  return (
    <div className="cd-section" {...rest}>
      <div className={classes.container}>
        <div className={classes.features1}>
          <GridContainer>
            <GridItem
              xs={12}
              sm={8}
              md={8}
              className={`${classes.mlAuto} ${classes.mrAuto}`}
            >
              <h2 className={classes.title} style={{
                marginTop: "50px",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 30,
                marginBottom: "0.5rem",
                lineHeight: "1.2",
              }}>¡Estas son nuestras ventajas!</h2>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={4} md={4}>
              <InfoArea
                vertical
                icon={Check}
                title="Configura tus datos"
                description="Añade tus datos y tus viviendas para garantizar una buena gestión"
                iconColor="info"
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <InfoArea
                vertical
                icon={Settings}
                title="Gestiona tus ofertas"
                description="Publica tu petición y encuentra el mejor servicio de limpieza "
                iconColor="danger"
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <InfoArea
                vertical
                icon={Wallet}
                title="Paga 100% seguro"
                description="Despreocúpate de los robos online con nuestro servicio online de pago"
                iconColor="success"
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem
              xs={12} sm={8} md={8}
              className={`${classes.mlAuto} ${classes.mrAuto}`}
              style={{
                marginTop: "40px"
              }}
            >
              <Button
                color="success"
                size="lg"
                href="/#/publicar-oferta"
                rel=""
              >
                <i className="fas fa-ticket-alt" />
                <a style={{ marginLeft: "5px", color: "#FFFFFF" }}>RESERVA ONLINE</a>
              </Button>
            </GridItem>

          </GridContainer>
        </div>
      </div>

      <div className={classes.container}>
        <div className={classes.features1}>
          <GridContainer>
            <GridItem
              xs={12} sm={8} md={8}
              className={`${classes.mlAuto} ${classes.mrAuto}`}
            >
              <h2 className={classes.title} style={{
                marginTop: "50px",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 30,
                marginBottom: "0.5rem",
                lineHeight: "1.2",
              }}>¡Regístrate como limpiador!</h2>
              <h4 className={classes.title} style={{
                marginTop: "50px",
                fontFamily: "inherit",
                fontWeight: 400,
                fontSize: 20,
                marginBottom: "0.5rem",
                lineHeight: "0.5",
              }}>¡Ofrece tus servicios al mundo!</h4>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem
              xs={12} sm={8} md={8}
              className={`${classes.mlAuto} ${classes.mrAuto}`}
              style={{
                marginTop: "50px"
              }}
            >
              <Button
                color="primary"
                size="lg"
                href="/#/signup"
                rel=""
              >
                <i className="fas fa-ticket-alt" />
                <a style={{ marginLeft: "5px", color: "#FFFFFF" }}>Regístrate</a>
              </Button>
            </GridItem>

          </GridContainer>
        </div>
      </div>
    </div>
  );
}

export default withStyles(featuresStyle)(SectionFeatures);
