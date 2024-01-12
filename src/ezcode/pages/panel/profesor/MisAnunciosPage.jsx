import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material"
import { ProfeNav } from "../../../components/ProfeNav"
import { jwtDecode } from "jwt-decode";
import ezcodeApi from "../../../../api/ezcodeApi"
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from "react"
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";

export const MisAnunciosPage = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.uid;
  const [anuncios, setAnuncios] = useState([]);
  const [profesor, setProfesor] = useState([]);
  const [solicitud, setSolicitud] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [imageUrls, setImageUrls] = useState({});
  const navigate = useNavigate();

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAnuncios = anuncios.slice(startIndex, endIndex);

  const obtenerUrlImagenAnuncio = async (idAnuncio) => {
    try {
      const response = await ezcodeApi.get(`uploads/anuncios/${idAnuncio}`, { responseType: 'arraybuffer' });
      const byteArray = new Uint8Array(response.data);
      const imageDataFromServer = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, byteArray))}`;
      return imageDataFromServer;
    } catch (error) {
      console.error('Error al obtener datos de usuario:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ezcodeApi.get(`profesor/${userId}`);
        const userDataFromServer = response.data.profesor;
        if (userDataFromServer) {
          setProfesor(userDataFromServer)
          try {
            const anunciosResponse = await ezcodeApi.get(`busqueda/anuncios/${userDataFromServer.correo}`);
            setAnuncios(anunciosResponse.data.results);
            const urls = {};
            for (const anuncio of anunciosResponse.data.results) {
              const url = await obtenerUrlImagenAnuncio(anuncio.uid);
              urls[anuncio.uid] = url;
              const solicitud = await ezcodeApi.get(`solicitudA/${anuncio.uid}`);
              setSolicitud(solicitud);

            }
            setImageUrls(urls);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const reenviarSolicitud = async (anuncioId) => {
    const solicitud = await ezcodeApi.get(`solicitudA/${anuncioId}`);
    if (solicitud.data == null) {
      try {
        const solicitudNueva = await ezcodeApi.post(`solicitudA/`, { anuncio: anuncioId });
        setSolicitud(solicitudNueva);
        const result = await Swal.fire({
          title: 'Solicitud enviada',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Continuar',
        });
        if (result.isConfirmed) {
          window.location.reload(false);
        }
      } catch (error) {
        console.log(error)
      }
    }
  };

  const borrarAnuncio = async (anuncioId) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de borrar este anuncio. Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        try {
          const response = await ezcodeApi.get(`solicitudA/${anuncioId}`);
          if (response && response.data) {
            await ezcodeApi.delete(`solicitudA/${response.data.uid}`);
          }
          await ezcodeApi.delete(`anuncio/${anuncioId}`);
        } catch (error) {
          console.error(error);
        }
        window.location.reload(false);
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al borrar el anuncio', 'error');
    }
  };

  return (
    <Box>
      <ProfeNav />
      <Grid
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Paper
          style={{
            padding: "16px",
            color: "black",
            flex: 1,
            width: "100%",
          }}
        >
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
            Mis anuncios
          </Typography>
          <Grid>
            {anuncios !== undefined && anuncios !== null && anuncios.length > 0 ? (
              <React.Fragment>
                <List>
                  {displayedAnuncios.map((anuncio, index) => (
                    <ListItem
                      key={index}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        margin: "8px",
                      }}
                      secondaryAction={
                        <Grid>
                          <IconButton
                            disabled={(solicitud && solicitud.data != null) || profesor.baneado}
                            edge="end"
                            aria-label="update"
                            style={{ marginRight: "8px" }}
                            onClick={() => navigate(`/profesor/anuncioEdit/${anuncio.uid}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            disabled={profesor.baneado}
                            edge="end"
                            aria-label="delete"
                            style={{ marginRight: "8px" }}
                            onClick={() => borrarAnuncio(anuncio.uid)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            disabled={anuncio.estado == true || (solicitud && solicitud.data != null) || profesor.baneado}
                            edge="end"
                            aria-label="delete"
                            style={{ marginRight: "8px" }}
                            onClick={() => reenviarSolicitud(anuncio.uid)}
                          >
                            <RefreshIcon />
                          </IconButton>
                        </Grid>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <img
                            src={imageUrls[anuncio.uid]}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Grid style={{ display: "flex" }}>
                            <span style={{ flexGrow: 1 }}>
                              Anuncio: {anuncio.nombre}
                            </span>
                            <span style={{ flexGrow: 1 }}>
                              Categoría: {anuncio.categoria}
                            </span>
                            <span style={{ flexGrow: 1 }}>
                              Estatus: {anuncio.estado ? "Activo" : "Inactivo"}
                              <span style={{ color: anuncio.estado ? "green" : "red", marginLeft: 5 }}>{'\u25CF'}</span>
                            </span>
                          </Grid>
                        }
                        secondary={
                          <Grid style={{ display: "flex" }}>
                            <span style={{ marginRight: "20px" }}>
                              {anuncio.profesor.nombre}
                            </span>
                            <span>{anuncio.profesor.correo}</span>
                          </Grid>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Pagination
                  count={Math.ceil(anuncios.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  style={{ marginTop: "16px" }}
                />
              </React.Fragment>
            ) : (
              <Typography sx={{ mt: 4, mb: 2 }}>
                No hay anuncios guardados en tu cuenta
              </Typography>
            )}
          </Grid>
          <hr />
          <Button disabled={profesor.baneado} variant="contained" onClick={() => navigate('/profesor/anuncio/crear')} style={{ marginTop: "16px" }}>
            Crear Anuncios
          </Button>
        </Paper>
      </Grid>
    </Box>
  );
};