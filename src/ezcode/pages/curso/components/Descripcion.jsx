import { Avatar, FormControl, FormControlLabel, IconButton, Radio, TextareaAutosize, Typography, Button, FormLabel, TextField, RadioGroup, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ezcodeApi from "../../../../api/ezcodeApi";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Swal from "sweetalert2";

export const Descripcion = ({ id }) => {
    const tipo = localStorage.getItem('tipo');

    const [imagen, setImagen] = useState('');
    const [alumno, setAlumno] = useState('');
    const [profesor, setProfesor] = useState('');

    const [curso, setCurso] = useState({
        nombre: '',
        categoria: '',
        descripcion: '',
        acreditado: false,
        carpeta: '',
    });

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        categoria: '',
    });

    const [formErrors, setFormErrors] = useState({
        nombre: false,
        descripcion: false,
        categoria: false,
    });


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ezcodeApi.get(`uploads/cursos/${id}`, { responseType: 'arraybuffer' });
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
                const response = await ezcodeApi.get(`curso/${id}`);
                const courseDataFromServer = response.data.curso;

                if (courseDataFromServer) {
                    setFormData({
                        nombre: courseDataFromServer.nombre || '',
                        descripcion: courseDataFromServer.descripcion || '',
                        categoria: courseDataFromServer.categoria || '',
                    });
                }

                setCurso(courseDataFromServer);
                const alumnoId = courseDataFromServer.alumno;
                const respAlumno = await ezcodeApi.get(`user/${alumnoId}`);
                setAlumno(respAlumno.data.alumno);
                const profeId = courseDataFromServer.profesor;
                const respProfe = await ezcodeApi.get(`profesor/${profeId}`);
                setProfesor(respProfe.data.profesor);

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
                const response = await ezcodeApi.put(`curso/details/${id}`, formData);
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
                const response = await ezcodeApi.put(`uploads/cursos/${id}`, formData);
                const nuevaImagen = response.data.imagen;
                setImagen(nuevaImagen);
                window.location.reload(false);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            {tipo === 'Alumno' ? (
                <div>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
                        {curso.nombre}
                    </Typography>
                    <br />
                    <Avatar src={imagen} sx={{ width: 100, height: 100 }} />
                    <br />
                    <Typography>Categoria: {curso.categoria}</Typography>
                    <Typography>
                        Estatus: {curso.acreditado ? "Acreditado" : "No acreditado"}
                        <span style={{ color: curso.acreditado ? "green" : "red", marginLeft: 5 }}>{'\u25CF'}</span>
                    </Typography>
                    <br />
                    <Typography>Descripción: <br /> {curso.descripcion}</Typography>
                    <hr />
                    <Typography>
                        Profesor: {profesor.nombre} {profesor.apellido} <br />
                        Correo: {profesor.correo}
                    </Typography>
                </div>
            ) : tipo === 'Profesor' && (
                <div>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
                        Descripcion del curso
                    </Typography>
                    <Avatar src={imagen} sx={{ width: 100, height: 100 }} />
                    <input accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" onChange={handleImageChange} />
                    <label htmlFor="icon-button-file">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCameraIcon />
                        </IconButton>
                    </label>
                    <br />
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Nombre"
                            name="nombre"
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
                                style={{ fontFamily: 'Arial', fontSize: '16px', resize: 'none', width: '100%' }}
                                required
                            />
                        </FormControl>
                        <br />
                        <br />
                        <Button type="submit" variant="contained" color="secondary">
                            Actualizar descripcion
                        </Button>
                    </form>
                    <hr />
                    <Typography>
                        Alumno: {alumno.nombre} {alumno.apellido} <br />
                        Correo: {alumno.correo}
                    </Typography>
                </div>
            )}
        </div>
    )
}
