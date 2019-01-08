import React, { useState } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import Check from "@material-ui/icons/Check";
//import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import MyHeader from "components/MyHeader.jsx"
import signupPageStyle from "utils/material-kit-pro-react/views/signupPageStyle.jsx";

import image from "../assets/img/bg7.jpg";

function Components(props)  {
  const name = useFormInput('');
  const email = useFormInput('');
  const password = useFormInput('');
  const repeatPassword = useFormInput('');
  const [checked, setChecked] = useState([1]);
  const { classes } = props;

  function handleToggle(value) {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  }

  function handleSubmit(e) {
    e.preventDefault();
    var sigue = true;
    if(name.value === "" && email.value === "" && password.value === "" && repeatPassword.value === "") {
      sigue = false;
      alert("El formulario está vacío")
    }
    
    else {
      if (name.value === "" || name.value.length < 5) {
        sigue = false;
        if(name.value === "") alert("El nombre de usuario no está rellenado");
        else if(name.value.length <=5) alert("El nombre de usuario debe tener al menos 5 caracteres");
      }
  
      else {
        if (email.value === "" || email.value.length <= 5) {
          sigue = false;
          if(email.value === "") alert("El email no está rellenado");
          else if(email.value.length <=5) alert("El email debe tener al menos 5 caracteres");
        } 
    
        else {
          let emailValid = email.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
          if(emailValid == null) {
            sigue = false;
            alert("El correo debe ser válido")
          } 
          else {
            if (password.value === "" || password.value.length <= 5) {
              sigue = false;
              if(password.value === "") alert("La contraseña no está rellenada");
              else if(password.value.length <=5) alert("La contraseña debe tener al menos 5 caracteres");
            }
            else {
              if(password.value !== repeatPassword.value) {
                sigue = false;
                alert("Las contraseñas no son iguales");
              }
            }
          }
        }
      }
    }
    
    if(sigue) props.history.push("/dashboard");
    
  }

  return (
    <div>
      <MyHeader />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={10} md={10}>
              <Card className={classes.cardSignup}>
                <h2 className={classes.cardTitle}>Regístrate</h2>
                <CardBody>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={6} md={6}>
                      <div className={classes.textCenter}>
                        <Button justIcon round color="twitter">
                          <i
                            className={classes.socials + " fab fa-twitter"}
                          />
                        </Button>
                        {` `}
                        <Button justIcon round color="facebook">
                          <i
                            className={classes.socials + " fab fa-facebook-f"}
                          />
                        </Button>
                        {` `}
                        <Button justIcon round color="google">
                          <i
                            className={classes.socials + " fab fa-google"}
                          />
                        </Button>
                        {` `}
                      </div>
                      <form className={classes.form}>
                        <CustomInput
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                          inputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className={classes.inputAdornment}
                              >
                                <Face
                                  className={classes.inputAdornmentIcon}
                                />
                              </InputAdornment>
                            ),
                            placeholder: "Nombre de Usuario",
                            type: "text",
                            value: name.value,
                            onChange: (event) => name.onChange(event)
                          }}
                        />
                        <CustomInput
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                          inputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className={classes.inputAdornment}
                              >
                                <Email
                                  className={classes.inputAdornmentIcon}
                                />
                              </InputAdornment>
                            ),
                            placeholder: "Email",
                            type: "text",
                            value: email.value,
                            onChange: (event) => email.onChange(event)
                          }}
                        />
                        <CustomInput
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                          inputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className={classes.inputAdornment}
                              >
                                <Icon className={classes.inputAdornmentIcon}>
                                  lock_outline
                                  </Icon>
                              </InputAdornment>
                            ),
                            placeholder: "Contraseña",
                            type: "password",
                            value: password.value,
                            onChange: (event) => password.onChange(event)
                          }}
                        />
                        <CustomInput
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                          inputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className={classes.inputAdornment}
                              >
                                <Icon className={classes.inputAdornmentIcon}>
                                  lock_outline
                                </Icon>
                              </InputAdornment>
                            ),
                            placeholder: "Repite la contraseña",
                            type: "password",
                            value: repeatPassword.value,
                            onChange: (event) => repeatPassword.onChange(event)
                          }}
                        />
                        <FormControlLabel
                          classes={{
                            label: classes.label
                          }}
                          control={
                            <Checkbox
                              tabIndex={-1}
                              onClick={() => handleToggle(1)}
                              checkedIcon={
                                <Check className={classes.checkedIcon} />
                              }
                              icon={
                                <Check className={classes.uncheckedIcon} />
                              }
                              classes={{
                                checked: classes.checked,
                                root: classes.checkRoot
                              }}
                              checked={
                                checked.indexOf(1) !== -1
                                  ? true
                                  : false
                              }
                            />
                          }
                          label={
                            <span>
                              Acepto los {" "}
                              <a href="#pablo">términos y condiciones</a>.
                              </span>
                          }
                        />
                        <div className={classes.textCenter}>
                          <Button round color="primary" onClick={(e) => handleSubmit(e)}>
                            Registrarse
                            </Button>
                        </div>
                      </form>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        {/*<Footer
          content={
            <div>
              <div className={classes.left}>
                <List className={classes.list}>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://www.creative-tim.com/"
                      className={classes.block}
                    >
                      FindMeChain
                      </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://www.creative-tim.com/presentation"
                      className={classes.block}
                    >
                      Sobre FindMeChain
                      </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="//blog.creative-tim.com/"
                      className={classes.block}
                    >
                      Stack Tecnológico
                      </a>
                  </ListItem>
                </List>
              </div>
              <div className={classes.right}>
                &copy; {1900 + new Date().getYear()} - Rubén González
                </div>
            </div>
          }
        />*/}
      </div>
    </div>
  );
}

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  return {
    value,
    onChange: handleChange
  }
}

export default withStyles(signupPageStyle)(Components);
