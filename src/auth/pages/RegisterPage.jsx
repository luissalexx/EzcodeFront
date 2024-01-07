import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Link, Radio, RadioGroup, Tab, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import ezcodeApi from '../../api/ezcodeApi';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import 'react-phone-input-2/lib/style.css'
import Swal from 'sweetalert2'

const formData = {
  nombre: '',
  apellido: '',
  nacimiento: '',
  correo: ''
}

const formValidations = {
  nombre: [(value) => value.length >= 1, 'El nombre es obligatorio'],
  apellido: [(value) => value.length >= 1, 'El apellido es obligatorio'],
  nacimiento: [(value) => value.length >= 1, 'La fecha es obligatoria'],
  correo: [(value) => value.length >= 1 && value.includes('@gmail.com') || value.includes('@ceti.mx'), 'El correo no es valido']
}


export const RegisterPage = () => {
  const navigate = useNavigate();
  const [celular, setCelular] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [value, setValue] = useState(1);
  const [sexo, setSexo] = useState();
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false)


  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const {
    nombre, apellido, nacimiento, correo, onInputChange, isFormValid,
    nombreValid, apellidoValid, nacimientoValid, correoValid
  } = useForm(formData, formValidations);



  const submitCliente = async (event) => {
    event.preventDefault();
    setFormSubmitted(true)
    if (!isFormValid) return;

    try {
      const data = await ezcodeApi.post('user/', { nombre: nombre, apellido: apellido, sexo: sexo, nacimiento: nacimiento, celular: celular, correo: correo })
      navigate('/auth/login', {
        replace: true
      });
    } catch (error) {
      const msg = JSON.stringify(error.response.data.errors)
      Swal.fire({
        title: 'Hubo un error al registrarse',
        text: msg,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }

  }

  const submitProfe = async (event) => {
    event.preventDefault();
    setFormSubmitted(true)
    if (!isFormValid) return;

    try {
      const data = await ezcodeApi.post('profesor/', { nombre: nombre, apellido: apellido, sexo: sexo, nacimiento: nacimiento, celular: celular, correo: correo })
      navigate('/auth/login', {
        replace: true
      });
    } catch (error) {
      const msg = JSON.stringify(error.response.data.errors)
      Swal.fire({
        title: 'Hubo un error al registrarse',
        text: msg,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }

  }

  const sendCode = async (event) => {
    event.preventDefault();
    try {
      const data = await ezcodeApi.post('auth/send-code', { celular: celular })
      console.log(data)
      Swal.fire({
        title: "Codigo enviado",
        text: "Revisa los mensajes SMS de tu celular",
        icon: "success"
      });
    } catch (error) {
      console.log(error.response.data)
    }
  }

  const verifyCode = async (event) => {
    event.preventDefault();
    try {
      const data = await ezcodeApi.post('auth/verify-code', { celular: celular, otp: otp })
      setOtpVerified(true)
      Swal.fire({
        title: "Celular verificado!",
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        title: "Hubo un problema con el codigo introducido",
        text: { error },
        icon: "success"
      });
    }
  }


  return (
    <Box>
      <AuthLayout title="Crear cuenta en EZCODE">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} centered>
              <Tab label="Datos" value={1} />
              <Tab label="Verificar celular" value={2} disabled={!isFormValid} />
              <Tab label="Registrarse" value={3} disabled={!isFormValid || otpVerified == false} />
            </TabList>
          </Box>
          <TabPanel value={1}>
            <p>Ingresa los siguientes datos: </p>
            <form>
              <Grid container>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <TextField
                    label="Nombre"
                    type="text"
                    placeholder='Nombres'
                    fullWidth
                    name="nombre"
                    value={nombre}
                    onChange={onInputChange}
                    autoComplete='off'
                    error={!!nombreValid && formSubmitted}
                    helperText={nombreValid}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <TextField
                    label="Apellido"
                    type="text"
                    placeholder='Apellido'
                    fullWidth
                    name="apellido"
                    value={apellido}
                    autoComplete='off'
                    onChange={onInputChange}
                    error={!!apellidoValid && formSubmitted}
                    helperText={apellidoValid}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="date"
                    fullWidth
                    name="nacimiento"
                    value={nacimiento}
                    autoComplete='off'
                    onChange={onInputChange}
                    error={!!nacimientoValid && formSubmitted}
                    helperText={nacimientoValid}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <label htmlFor="celular">Celular</label>
                  <PhoneInput
                    disabled={otpVerified == true}
                    country={'mx'}
                    placeholder='Celular'
                    fullWidth
                    autoComplete='off'
                    name="celular"
                    value={celular}
                    onChange={(celular) => setCelular(celular)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <TextField
                    label="Correo"
                    type="email"
                    placeholder='correo@gmail.com'
                    fullWidth
                    name="correo"
                    autoComplete='off'
                    value={correo}
                    onChange={onInputChange}
                    error={!!correoValid && formSubmitted}
                    helperText={correoValid}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Genero</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="sexo"
                      defaultValue="Mujer"
                    >
                      <FormControlLabel value="Mujer" control={<Radio />} label="Mujer" onChange={e => setSexo(e.target.value)} />
                      <FormControlLabel value="Hombre" control={<Radio />} label="Hombre" onChange={e => setSexo(e.target.value)} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
            <br />
            <hr />
            <Button
              className="success"
              disabled={value === 1}
              onClick={() => setValue((newValue) => newValue - 1)}
            >
              Anterior
            </Button>
            <Button
              className="success"
              disabled={!isFormValid || value == 3 || celular.length < 10}
              onClick={() => setValue((newValue) => newValue + 1)}
            >
              Siguiente
            </Button>
          </TabPanel>

          <TabPanel value={2}>
            <p>Envia un codigo por SMS a su celular para verificar el numero que ingresó</p>
            <Grid container>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  disabled={otpVerified == true}
                  label="Codigo"
                  type="text"
                  placeholder='Ingrese el codigo'
                  fullWidth
                  autoComplete='off'
                  name="codigo"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
                <Button
                  disabled={otpVerified == true}
                  className="success"
                  onClick={verifyCode}
                >
                  Verificar Codigo
                </Button>
                <Button
                  disabled={otpVerified == true}
                  className="success"
                  onClick={sendCode}
                >
                  Solicitar Codigo
                </Button>
              </Grid>
            </Grid>
            <br />
            <hr />
            <Button
              className="success"
              onClick={() => setValue((newValue) => newValue - 1)}
            >
              Anterior
            </Button>
            <Button
              className="success"
              disabled={otpVerified == false}
              onClick={() => setValue((newValue) => newValue + 1)}
            >
              Siguiente
            </Button>
          </TabPanel>

          <TabPanel value={3}>
            <p>Para finalizar seleccione el rol que tendrá su cuenta </p>
            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={12}>
                <Button variant='contained' fullWidth type='submit' onClick={submitCliente}>
                  Crear cuenta como alumno
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={12}>
                <Button variant='contained' fullWidth type='submit' onClick={submitProfe}>
                  Crear cuenta como profesor
                </Button>
              </Grid>
            </Grid>
            <br />
            <hr />
            <Button
              className="success"
              onClick={() => setValue((newValue) => newValue - 1)}
            >
              Anterior
            </Button>
            <Button
              className="success"
              onClick={() => setValue((newValue) => newValue + 1)}
            >
              Siguiente
            </Button>
          </TabPanel>
        </TabContext>

        <Grid container direction='row' justifyContent='end'>
          <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
          <Link component={RouterLink} color='inherit' to="/auth/login">
            Inicia Sesion
          </Link>
        </Grid>
      </AuthLayout>
    </Box>
  )
}