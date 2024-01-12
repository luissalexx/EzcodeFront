import { Avatar, Button, Typography, Rating } from "@mui/material"
import { ChangeNav } from "../components/ChangeNav"
import { Link } from 'react-scroll';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from 'react-dom/server';
import Slider from 'react-slick';
import { jwtDecode } from "jwt-decode";
import ezcodeApi from "../../api/ezcodeApi";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from "sweetalert2";
import { ChangeFootNav } from "../components/ChangeFootNav";

export const HomePage = () => {

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.uid : null;
  const tipo = localStorage.getItem('tipo');

  const [anuncios, setAnuncios] = useState([]);
  const [populares, setPopulares] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [alumno, setAlumno] = useState({});
  const [imagePopularesUrls, setImagePopularesUrls] = useState({});
  const navigate = useNavigate();

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
        if (tipo === "Alumno") {
          const response = await ezcodeApi.get(`user/${userId}`);
          setAlumno(response.data.alumno);
        }

        const anunciosResponse = await ezcodeApi.get('anuncio/published/');
        setAnuncios(anunciosResponse.data.results);

        const urls = {};
        for (const anuncio of anunciosResponse.data.results) {
          const url = await obtenerUrlImagenAnuncio(anuncio.uid);
          urls[anuncio.uid] = url;
        }
        setImageUrls(urls);

      } catch (error) {
        console.error('Error al obtener los anuncios', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const anunciosResponse = await ezcodeApi.get('anuncio/populars/');
        setPopulares(anunciosResponse.data);

        const urls = {};
        for (const anuncio of anunciosResponse.data) {
          const url = await obtenerUrlImagenAnuncio(anuncio.uid);
          urls[anuncio.uid] = url;
        }
        setImagePopularesUrls(urls);

      } catch (error) {
        console.error('Error al obtener los anuncios', error);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(5, anuncios.length),
    slidesToScroll: 1,
  };

  const viewAnuncio = async (idAnuncio) => {
    try {
      const response = await ezcodeApi.get(`anuncio/${idAnuncio}`);
      const solicitudes = await ezcodeApi.get(`solicitudC/${idAnuncio}`)
      const anuncio = response.data.anuncio;
      const imagen = await obtenerUrlImagenAnuncio(idAnuncio);

      const contenido = ReactDOMServer.renderToString(
        <div>
          <Typography>Nombre: {anuncio.nombre}</Typography>
          <br />
          <Typography>Categoria: {anuncio.categoria}</Typography>
          <br />
          <Typography variant='body1'>Descripcion: <br />{anuncio.descripcion}</Typography>
          <br />
          <Typography>Precio base del curso: {anuncio.precio}MXN</Typography>
          <br />
          <hr />
          <Typography>Profesor: {anuncio.profesor.nombre}</Typography>
          <Typography>Correo: {anuncio.profesor.correo}</Typography>
        </div>
      );
      const result = await Swal.fire({
        title: 'Detalles del Anuncio',
        html: contenido,
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#666666',
        showCancelButton: true,
        iconHtml: `<img src=${imagen} style="width: 100px; height: 100px;" />`,
        confirmButtonText: 'Mandar Solicitud',
      });

      if (result.isConfirmed) {
        if (token == null) {
          navigate('/auth/login', {
            replace: true
          });
        } else {
          if (tipo === "Alumno" && solicitudes.data == null) {
            await ezcodeApi.post('solicitudC/', { anuncio: idAnuncio, profesor: anuncio.profesor });
            Swal.fire({
              title: 'Solicitud enviada',
              text: 'Ten en cuenta que puede tardar en ser aceptada por el cupo limitado de cursos que tiene el profesor, puedes ver la solicitud en tu carrito',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            });
          } else {
            if (tipo !== "Alumno") {
              Swal.fire({
                title: 'No tienes los permisos para enviar una solicitud',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
              });
            } else {
              Swal.fire({
                title: 'Ya enviaste una solicitud previamente',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="backHome">
      <ChangeNav />
      <div style={{ height: '100vh' }}>
        <h1 className="helveticaNeue" style={{ fontSize: '180px', lineHeight: '0.8', display: 'flex', flexDirection: 'column', marginTop: '50px' }}>
          <span style={{ marginLeft: '3%' }}>we made</span>
          <span style={{ marginLeft: '30%' }}>coding</span>
          <span style={{ marginLeft: '8%' }}>easier</span>
          <span style={{ marginLeft: '25%' }}>for you</span>
        </h1>
        <Typography style={{ position: 'absolute', top: '50%', left: '65%', fontSize: '25px' }}>
          En Ezecode ofrecemos caminos de aprendizaje estructurados para diferentes temas o lenguajes de programacion
          con clases personalizadas impartidas por usuarios profesores de todo el mundo
        </Typography>

        <div style={{ position: 'absolute', bottom: '30px', left: '50%' }}>
          <Link to="section2" smooth={true} duration={500} style={{ fontSize: '24px', padding: '10px' }}>
            Ver más
          </Link>
        </div>
      </div>

      <div name="section2" style={{ height: '100vh' }}>
        <Typography style={{ position: 'absolute', top: '115%', left: '5%', fontSize: '50px' }}>
          Explora los cursos publicados en la página
        </Typography>
        <div style={{ width: '75%', margin: 'auto', position: 'absolute', top: '130%', left: '12%' }}>
          <div style={{ marginTop: '20px', padding: '20px' }}>
            <Slider {...settings}>
              {anuncios.map((anuncio, index) => (
                <div key={index} style={{ width: '100%', height: '400px', boxSizing: 'border-box' }}>
                  <div style={{ border: '2px solid white', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ padding: '20px' }}>
                      <Avatar
                        style={{ display: 'block', margin: 'auto', height: 200, width: 200, borderRadius: '10px' }}
                        src={imageUrls[anuncio.uid]}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        overflow: 'auto',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        padding: '1rem'
                      }}>
                      <Typography style={{ fontSize: '40px' }}>
                        {anuncio.nombre}
                      </Typography>
                      <Typography style={{ fontSize: '20px' }}>
                        Precio base del curso: {anuncio.precio}MXN
                      </Typography>
                      <Typography style={{ fontSize: '20px' }}>
                        Profesor: {anuncio.profesor.nombre} {anuncio.profesor.apellido}
                      </Typography>
                      <Rating name="read-only" value={anuncio.calificacion} readOnly style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }} />
                      {alumno.baneado ? (
                        <Typography>
                          No puedes ver los detalles del anuncio, tu cuenta esta baneada
                        </Typography>
                      ) : (
                        <Button variant="contained" style={{ borderRadius: '10px', border: '2px solid white' }}
                          onClick={() => viewAnuncio(anuncio.uid)}>
                          Ver más
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      {alumno.acreditados > 4 && tipo === "Alumno" ? (
        <div name="section3" style={{ height: '90vh' }}>
          <div>
            <Typography style={{ position: 'absolute', top: '200%', left: '5%', fontSize: '50px' }}>
              Los cursos más populares
            </Typography>
            <div style={{ width: '75%', margin: 'auto', position: 'absolute', top: '215%', left: '12%' }}>
              <div style={{ marginTop: '20px', padding: '20px' }}>
                <Slider {...settings}>
                  {populares.map((popular, index) => (
                    <div key={index} style={{ width: '100%', height: '400px', boxSizing: 'border-box' }}>
                      <div style={{ border: '2px solid white', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ padding: '20px' }}>
                          <Avatar
                            style={{ display: 'block', margin: 'auto', height: 200, width: 200, borderRadius: '10px' }}
                            src={imagePopularesUrls[popular.uid]}
                          />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'auto',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '1rem'
                          }}>
                          <Typography style={{ fontSize: '40px' }}>
                            {popular.nombre}
                          </Typography>
                          <Typography style={{ fontSize: '20px' }}>
                            Precio base del curso: {popular.precio}MXN
                          </Typography>
                          <Typography style={{ fontSize: '20px' }}>
                            Profesor: {popular.profesor.nombre} {popular.profesor.apellido}
                          </Typography>
                          <Rating name="read-only" value={popular.calificacion} readOnly style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }} />
                          {alumno.baneado ? (
                            <Typography>
                              No puedes ver los detalles del anuncio, tu cuenta esta baneada
                            </Typography>
                          ) : (
                            <Button variant="contained" style={{ borderRadius: '10px', border: '2px solid white' }}
                              onClick={() => viewAnuncio(popular.uid)}>
                              Ver más
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      ) : (null)}
      <ChangeFootNav />
    </div>
  );
};