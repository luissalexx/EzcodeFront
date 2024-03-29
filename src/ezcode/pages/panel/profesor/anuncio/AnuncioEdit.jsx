import { useNavigate, useParams } from 'react-router-dom';
import { ProfeNav } from '../../../../components/ProfeNav'
import { useEffect, useState } from 'react';
import { Avatar, Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, TextField, TextareaAutosize, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ezcodeApi from '../../../../../api/ezcodeApi';
import Swal from 'sweetalert2';

export const AnuncioEdit = () => {
  const { id } = useParams();
  const [profesor, setProfesor] = useState({});
  const [solicitud, setSolicitud] = useState({});
  const [imagen, setImagen] = useState('');
  const [imagenProfe, setImagenProfe] = useState('');
  const navigate = useNavigate();

  const [anuncioData, setAnuncioData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    estado: false,
    profesor: {
      _id: '',
      nombre: '',
      correo: '',
    }
  });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
  });

  const [formErrors, setFormErrors] = useState({
    nombre: false,
    descripcion: false,
    categoria: false,
  });

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await ezcodeApi.get(`uploads/anuncios/${id}`, { responseType: 'arraybuffer' });
        const byteArray = new Uint8Array(response.data);
        const imageDataFromServer = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, byteArray))}`;
        setImagen(imageDataFromServer);
      } catch (error) {
        console.error('Error al obtener datos de imagen:', error);
      }
    };

    fetchImageData();
  }, []);

  useEffect(() => {
    if (anuncioData.profesor && anuncioData.profesor._id) {
      const fetchImageData = async () => {
        try {
          const response = await ezcodeApi.get(`uploads/profesors/${anuncioData.profesor._id}`, { responseType: 'arraybuffer' });
          const byteArray = new Uint8Array(response.data);
          const imageDataFromServer = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, byteArray))}`;
          setImagenProfe(imageDataFromServer);
        } catch (error) {
          console.error('Error al obtener datos de imagen:', error);
        }
      };

      fetchImageData();
    }
  }, [anuncioData.profesor._id]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ezcodeApi.get(`anuncio/${id}`);
        const anuncioDataFromServer = response.data.anuncio;
        if (anuncioDataFromServer) {
          const responseSolicitud = await ezcodeApi.get(`solicitudA/${id}`);
          setSolicitud(responseSolicitud.data);

          const respProfe = await ezcodeApi.get(`profesor/${anuncioDataFromServer.profesor._id}`);
          setProfesor(respProfe.data.profesor);
          setAnuncioData(anuncioDataFromServer);
          setFormData({
            nombre: anuncioDataFromServer.nombre || '',
            descripcion: anuncioDataFromServer.descripcion || '',
            categoria: anuncioDataFromServer.categoria || '',
            precio: anuncioDataFromServer.precio,
          });
        } else {
          console.error('No se encontraron datos de usuario en la respuesta del servidor');
        }
      } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'precio' ? (value === null || value === '' ? 0 : Math.max(0, parseFloat(value))) : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de formulario
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'precio') {
        errors[key] = true;
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await ezcodeApi.put(`anuncio/details/${id}`, formData);
        if (response) {
          await ezcodeApi.post('solicitudA/', { anuncio: id });
        }
        Swal.fire({
          title: 'Datos actualizados con éxito',
          text: 'Se envió una solicitud al administrador para su revision. No podrás actualizar el anuncio hasta que se revise la solicitud',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/profesor/anuncios', {
              replace: true
            });
          }
        });
      } catch (error) {
        console.log(error)
      }
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    // Verifica si se seleccionó un archivo
    if (file) {
      const formData = new FormData();
      formData.append('archivo', file);

      try {
        const response = await ezcodeApi.put(`uploads/anuncios/${id}`, formData);
        const nuevaImagen = response.data.imagen;
        await ezcodeApi.post('solicitudA/', { anuncio: id });

        setImagen(nuevaImagen);
        window.location.reload(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <ProfeNav />
      <Grid container spacing={0} style={{ height: '100vh' }}>
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={imagen} sx={{ width: 100, height: 100 }} />
            <input accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" onChange={handleImageChange} />
            <label htmlFor="icon-button-file">
              <IconButton disabled={profesor.baneado || solicitud} color="primary" aria-label="upload picture" component="span">
                <PhotoCameraIcon />
              </IconButton>
            </label>
            <Typography variant="h6" gutterBottom>
              Datos del Anuncio
            </Typography>
            {anuncioData && (
              <div>
                <Typography>Nombre: {anuncioData.nombre}</Typography>
                <Typography>Categoria: {anuncioData.categoria}</Typography>
                <Typography variant='body1'>Descripcion: {anuncioData.descripcion}</Typography>
                <Typography>Precio: {anuncioData.precio}MXN</Typography>
                <Typography>Estatus: {anuncioData.estado ? "Activo" : "Inactivo"}
                  <span style={{ color: anuncioData.estado ? "green" : "red", marginLeft: 5 }}>{'\u25CF'}</span>
                </Typography>
                <hr />
                <Avatar src={imagenProfe} sx={{ width: 100, height: 100 }} />
                <br />
                <Typography>Profesor: {anuncioData.profesor.nombre}</Typography>
                <Typography>Correo: {anuncioData.profesor.correo}</Typography>
              </div>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper style={{ padding: 16, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Actualizar Datos
            </Typography>
            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Nombre"
                name="nombre"
                autoComplete='off'
                value={formData.nombre}
                fullWidth
                margin="normal"
                onChange={handleChange}
                error={formErrors.nombre}
                helperText={formErrors.nombre && 'El nombre es obligatorio'}
              />
              <Grid item xs={12} sx={{ mt: 2 }}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Categoria</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="categoria"
                    onChange={handleChange}
                    value={formData.categoria}
                    defaultValue={formData.categoria}
                  >
                    <FormControlLabel value="JavaScript" control={<Radio />} label="JavaScript" />
                    <FormControlLabel value="Java" control={<Radio />} label="Java" />
                    <FormControlLabel value="CSharp" control={<Radio />} label="CSharp" />
                    <FormControlLabel value="Python" control={<Radio />} label="Python" />
                    <FormControlLabel value="SQL" control={<Radio />} label="SQL" />
                    <FormControlLabel value="Html" control={<Radio />} label="Html" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <FormControl fullWidth>
                <label>Descripción</label>
                <TextareaAutosize
                  onChange={handleChange}
                  name="descripcion"
                  id="descripcion"
                  color="neutral"
                  value={formData.descripcion}
                  minRows={10}
                  maxRows={10}
                  autoComplete='off'
                  style={{ fontFamily: 'Arial', fontSize: '16px', resize: 'none', width: '100%' }}
                  required
                />
              </FormControl>
              <div>
                <br />
                <Typography>
                  Precio
                </Typography>
                <TextField
                  name="precio"
                  type='number'
                  value={formData.precio}
                  autoComplete='off'
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                />
              </div>
              <Button disabled={profesor.baneado || solicitud} type="submit" variant="contained" color="secondary">
                Actualizar Anuncio
              </Button>
              <Button onClick={() => navigate(-1)} color="primary">
                Volver
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}
