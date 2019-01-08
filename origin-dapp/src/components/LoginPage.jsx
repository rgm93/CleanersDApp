import React, { useState, useEffect } from "react"; 
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
//import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import loginPageStyle from "utils/material-kit-pro-react/views/loginPageStyle.jsx";
import MyHeader from "components/MyHeader.jsx"
import LoginUser from "pages/profile/LoginUsuario.js"
import image from "../assets/img/bg7.jpg";

function LoginPage(props) {

  const email = useFormInput('');
  const password = useFormInput('');
  /*const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');*/
  const auth = useFormInput('false');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  function handleSubmit(e) {
    e.preventDefault();
    var sigue = true;
    if (email.value === "" && email.value.length <= 5) {
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
        if (password.value === "" && password.value.length <= 5) {
          sigue = false;
          alert("La contraseña no es correcta");
        }
      }
    }

    if(sigue) props.history.push("/dashboard");
  }

  return (
    <div>
      <LoginUser />
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

export default withStyles(loginPageStyle)(LoginPage);
