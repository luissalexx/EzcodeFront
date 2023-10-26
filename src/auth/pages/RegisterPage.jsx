import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
import ezcodeApi from '../../api/ezcodeApi';

const formData = {
  nombre: '',
  apellido: '',
  sexo: '',
  nacimiento: '',
  celular: '',
  correo: ''
}

const formValidations = {
  nombre: [(value) => value.length >= 1, 'El nombre es obligatorio'],
  apellido: [(value) => value.length >= 1, 'El apellido es obligatorio'],
  sexo: [(value) => value.length >= 1, 'El dato es obligatorio'],
  nacimiento: [(value) => value.length >= 1, 'La fecha es obligatoria'],
  celular: [(value) => value.length >= 1, 'El celular es obligatorio'],
  correo: [(value) => value.length >= 1 && value.includes('@gmail.com') || value.includes('@ceti.mx'), 'El correo no es valido']
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    nombre, apellido, sexo, nacimiento, celular, correo, onInputChange, isFormValid,
    nombreValid, apellidoValid, sexoValid, nacimientoValid, celularValid, correoValid
  } = useForm(formData, formValidations);
  
  const submitCliente = async (event) => {
    event.preventDefault();
    setFormSubmitted(true)
    if (!isFormValid) return;

    try {
      const data = await ezcodeApi.post('user/', {nombre: nombre, apellido: apellido, sexo: sexo, nacimiento: nacimiento, celular: celular, correo: correo})
      navigate('/auth/login', {
        replace: true
      });
    } catch (error) {
      console.log(error)
    }

  }

  const submitProfe = async (event) => {
    event.preventDefault();
    setFormSubmitted(true)
    if (!isFormValid) return;

    try {
      const data = await ezcodeApi.post('profesor/', {nombre: nombre, apellido: apellido, sexo: sexo, nacimiento: nacimiento, celular: celular, correo: correo})
      navigate('/auth/login', {
        replace: true
      });
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <AuthLayout title="Crear cuenta en EZCODE">
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
              onChange={onInputChange}
              error={!!apellidoValid && formSubmitted}
              helperText={apellidoValid}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Sexo"
              type="text"
              placeholder='Sexo'
              fullWidth
              name="sexo"
              value={sexo}
              onChange={onInputChange}
              error={!!sexoValid && formSubmitted}
              helperText={sexoValid}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              type="date"
              fullWidth
              name="nacimiento"
              value={nacimiento}
              onChange={onInputChange}
              error={!!nacimientoValid && formSubmitted}
              helperText={nacimientoValid}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Celular"
              type="tel"
              placeholder='Celular'
              fullWidth
              name="celular"
              value={celular}
              onChange={onInputChange}
              error={!!celularValid && formSubmitted}
              helperText={celularValid}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Correo"
              type="email"
              placeholder='correo@gmail.com'
              fullWidth
              name="correo"
              value={correo}
              onChange={onInputChange}
              error={!!correoValid && formSubmitted}
              helperText={correoValid}
            />

          </Grid>
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={12}>
              <Button variant='contained' fullWidth type='submit' onClick={submitCliente}>
                Crear cuenta
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

          <Grid container direction='row' justifyContent='end'>
            <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
            <Link component={RouterLink} color='inherit' to="/auth/login">
              Inicia Sesion
            </Link>
          </Grid>

        </Grid>

      </form>

    </AuthLayout>
  )
}