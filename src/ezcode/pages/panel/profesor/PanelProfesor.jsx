import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import ezcodeApi from '../../../../api/ezcodeApi';
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import Swal from 'sweetalert2'
import { ProfeNav } from '../../../components/ProfeNav';

export const PanelProfesor = () => {

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false)
  const [isButtonDisabled, setButtonDisabled] = useState(false);

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
    nacimiento: false,
    sexo: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ezcodeApi.get(`uploads/administradors/${userId}`);
        const imageDataFromServer = response.data.pathImagen;
        setImagen(imageDataFromServer);
      } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
      }
    };
  
    fetchUserData();
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ezcodeApi.get(`profe/${userId}`);
        const userDataFromServer = response.data.profesor;

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
        ezcodeApi.put(`profe/${userId}`, formData);
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
        const response = await ezcodeApi.delete(`profe/${userId}`);
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

  return (
    <div>
      <ProfeNav />
      <Grid container spacing={0} style={{ height: '100vh' }}>
        {/* Columna Izquierda */}
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar style={{ width: 80, height: 80, marginBottom: 10 }}>
              <PersonIcon style={{ fontSize: 48 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Datos del Usuario
            </Typography>
            {userData && (
              <>
                <Typography>Nombre: {userData.nombre}</Typography>
                <Typography>Apellido: {userData.apellido}</Typography>
                <Typography>Celular: {userData.celular}</Typography>
                <Typography>Fecha de Nacimiento: {userData.nacimiento}</Typography>
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
            <br />
            <hr />
            <Typography variant="h6" gutterBottom>
              Eliminar cuenta
            </Typography>
            <p>Al elimnar la cuenta ya no se podra acceder a los cursos de la cuenta y seras redirigido a la pagina de inicio</p>
            <Button onClick={deleteUser} variant="contained" color="secondary">
              Borrar Usuario
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};