import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Avatar } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import ezcodeApi from '../../../../api/ezcodeApi';
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import Swal from 'sweetalert2'
import { ClienteNav } from '../../../components/ClienteNav';
import { useNavigate } from 'react-router-dom';

export const PanelCliente = () => {

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false)
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [imagen, setImagen] = useState('');

  const navigate = useNavigate();
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
    baneado: false
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
    nacimiento: false,
    sexo: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ezcodeApi.get(`uploads/clientes/${userId}`, { responseType: 'arraybuffer' });
        const byteArray = new Uint8Array(response.data);
        const imageDataFromServer = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, byteArray))}`;
        setImagen(imageDataFromServer);
      } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ezcodeApi.get(`user/${userId}`);
        const userDataFromServer = response.data.alumno;

        if (userDataFromServer) {
          setUserData(userDataFromServer);
          setFormData({
            nombre: userDataFromServer.nombre || '',
            apellido: userDataFromServer.apellido || '',
            celular: userDataFromServer.celular || '',
            sexo: userDataFromServer.sexo || '',
          });
          setOtpVerified(true);
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
        ezcodeApi.put(`user/${userId}`, formData);
        Swal.fire({
          title: 'Datos actualizados con éxito',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(false);
          }
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
      if (formData.celular != userData.celular) {
        setOtpVerified(false);
      }
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
      const response = await ezcodeApi.post('auth/verify-code', { celular: formData.celular, otp: otp })
      if (response.data.status === "approved") {
        setOtpVerified(true);
        Swal.fire({
          title: "Celular verificado!",
          icon: "success"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Hubo un problema al procesar la solicitud",
        text: error.response.data.message,
        icon: "error"
      });
    }
  }

  const deleteUser = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de borrar este usuario. Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await ezcodeApi.delete(`curso/all/${userId}`);
        await ezcodeApi.delete(`solicitudC/all/${userId}`);

        const response = await ezcodeApi.delete(`user/${userId}`);
        if (response.status === 200) {
          Swal.fire('Borrado', 'El usuario ha sido borrado correctamente', 'success');
          localStorage.clear();
          navigate('/', {
            replace: true
          });
        } else {
          Swal.fire('Error', 'Hubo un error al borrar el usuario', 'error');
        }
      }
    } catch (error) {
      console.error('Error al borrar el usuario:', error);
      Swal.fire('Error', 'Hubo un error al borrar el usuario', 'error');
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    // Verifica si se seleccionó un archivo
    if (file) {
      const formData = new FormData();
      formData.append('archivo', file);

      try {
        const response = await ezcodeApi.put(`uploads/clientes/${userId}`, formData);
        const nuevaImagen = response.data.imagen;
        setImagen(nuevaImagen);
        window.location.reload(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <ClienteNav />
      <Grid container spacing={0} style={{ height: '100vh' }}>
        {/* Columna Izquierda */}
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={imagen} sx={{ width: 100, height: 100 }} />
            <input accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" onChange={handleImageChange} />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCameraIcon />
              </IconButton>
            </label>
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
                {userData.baneado ? (
                  <div>
                    <hr />
                    <Typography>Usuario Baneado</Typography>
                  </div>
                ) : null}
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
                autoComplete='off'
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
                autoComplete='off'
                margin="normal"
                error={formErrors.apellido}
                helperText={formErrors.apellido && 'Apellido es obligatorio'}
              />
              <div>
                <label htmlFor="celular">Celular</label>
                <PhoneInput
                  disabled={userData.baneado}
                  country={'mx'}
                  placeholder='Celular'
                  fullWidth
                  autoComplete='off'
                  value={formData.celular}
                  onChange={(value) => handleChange({ target: { name: 'celular', value } })}
                  margin="normal"
                  error={formErrors.celular}
                  helperText={formErrors.celular && 'Celular es obligatorio'}
                  id="celular"
                />
                {formData.celular.length === 12 ? (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <p>Si se cambia o se borra algún número del celular es necesario volver a verificarlo</p>
                    <TextField
                      disabled={otpVerified == true || userData.baneado}
                      label="Codigo de verificacion"
                      type="text"
                      placeholder='Ingrese el codigo'
                      fullWidth
                      autoComplete='off'
                      name="codigo"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                    />
                    <Button
                      className="success"
                      onClick={verifyCode}
                      disabled={otpVerified == true || userData.baneado}
                    >
                      Verificar Codigo
                    </Button>
                    <Button
                      className="success"
                      onClick={sendCode}
                      disabled={otpVerified == true || isButtonDisabled || userData.baneado}
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
                  >
                    <FormControlLabel value="Mujer" control={<Radio />} label="Mujer" onChange={handleChange} />
                    <FormControlLabel value="Hombre" control={<Radio />} label="Hombre" onChange={handleChange} />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Button type="submit" variant="contained" color="secondary" disabled={otpVerified == false || formData.celular.length !== 12 || userData.baneado}>
                Actualizar
              </Button>
            </form>
            <br />
            <hr />
            <Typography variant="h6" gutterBottom>
              Eliminar cuenta
            </Typography>
            <p>Al eliminar la cuenta ya no se podra acceder a los cursos de la cuenta y seras redirigido a la pagina de inicio</p>
            <Button onClick={deleteUser} variant="contained" color="secondary">
              Borrar Usuario
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
