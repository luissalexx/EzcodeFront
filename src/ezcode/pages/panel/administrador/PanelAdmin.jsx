import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import ezcodeApi from '../../../../api/ezcodeApi';
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2';
import { AdminNav } from '../../../components/AdminNav';

import Swal from 'sweetalert2'

export const PanelAdmin = () => {

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false)
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [imagen, setImagen] = useState('');

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.uid;

  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    nacimiento: '',
    correo: '',
    sexo: '',
  });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    sexo: '',
  });

  const [formErrors, setFormErrors] = useState({
    nombre: false,
    apellido: false,
    celular: false,
    sexo: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ezcodeApi.get(`uploads/administradors/${userId}`, { responseType: 'arraybuffer' });
        const byteArray = new Uint8Array(response.data);
        const imageDataFromServer = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, byteArray))}`;
        setImagen(imageDataFromServer);
        console.log('Imagen desde el servidor:', imageDataFromServer);
      } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ezcodeApi.get(`admin/${userId}`);
        const userDataFromServer = response.data.admin;

        if (userDataFromServer) {
          setUserData(userDataFromServer);
        } else {
          console.error('No se encontraron datos de usuario en la respuesta del servidor');
        }
      } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de formulario
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        errors[key] = true;
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        ezcodeApi.put(`admin/${userId}`, formData);
        window.location.reload(false);
        Swal.fire({
          title: "Datos actualizados con exito",
          icon: "success"
        });
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  const handleChange = (e) => {
    // Verifica si el evento proviene de PhoneInput
    if (e.target) {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    } else {
      // Maneja el evento de PhoneInput sin e.target
      setFormData((prevData) => ({ ...prevData, celular: e }));
      setFormErrors((prevErrors) => ({ ...prevErrors, celular: false }));
    }
  };

  const sendCode = async (event) => {
    event.preventDefault();
    try {
      const data = await ezcodeApi.post('auth/send-code', { celular: formData.celular })
      setButtonDisabled(true);
      setTimeout(() => {
        setButtonDisabled(false);
      }, 30000);
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
      const data = await ezcodeApi.post('auth/verify-code', { celular: formData.celular, otp: otp })
      setOtpVerified(true)
      console.log(data)
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
    <div>
      <AdminNav />
      <Grid container spacing={0} style={{ height: '100vh' }}>
        {/* Columna Izquierda */}
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton style={{ fontSize: 48 }}>
              <img src={imagen} style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              Datos del Usuario
            </Typography>
            {userData && (
              <>
                <Typography>Nombre: {userData.nombre}</Typography>
                <Typography>Apellido: {userData.apellido}</Typography>
                <Typography>Celular: {userData.celular}</Typography>
                <Typography>Correo: {userData.correo}</Typography>
                <Typography>Genero: {userData.sexo}</Typography>
              </>
            )}
          </Paper>
        </Grid>
        {/* Columna Derecha */}
        <Grid item xs={12} sm={8}>
          <Paper style={{ padding: 16, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Actualizar Datos
            </Typography>
            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Nombres"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={formErrors.nombre}
                helperText={formErrors.nombre && 'Nombre es obligatorio'}
              />
              <TextField
                label="Apellidos"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={formErrors.apellido}
                helperText={formErrors.apellido && 'Apellido es obligatorio'}
              />
              <div>
                <label htmlFor="celular">Celular</label>
                <PhoneInput
                  disabled={otpVerified == true}
                  country={'mx'}
                  placeholder='Celular'
                  fullWidth
                  value={formData.celular}
                  onChange={(value) => handleChange({ target: { name: 'celular', value } })}
                  margin="normal"
                  error={formErrors.celular}
                  helperText={formErrors.celular && 'Celular es obligatorio'}
                  id="celular"
                />
                {formData.celular.length === 12 ? (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField
                      disabled={otpVerified == true}
                      label="Codigo de verificacion"
                      type="text"
                      placeholder='Ingrese el codigo'
                      fullWidth
                      name="codigo"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                    />
                    <Button
                      className="success"
                      onClick={verifyCode}
                      disabled={otpVerified == true}
                    >
                      Verificar Codigo
                    </Button>
                    <Button
                      className="success"
                      onClick={sendCode}
                      disabled={otpVerified == true || isButtonDisabled}
                    >
                      Solicitar Codigo
                    </Button>
                  </Grid>
                ) : null}
              </div>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Genero</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="sexo"
                    defaultValue="Mujer"
                  >
                    <FormControlLabel value="Mujer" control={<Radio />} label="Mujer" onChange={handleChange} />
                    <FormControlLabel value="Hombre" control={<Radio />} label="Hombre" onChange={handleChange} />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Button type="submit" variant="contained" color="secondary" disabled={otpVerified == false}>
                Actualizar
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};