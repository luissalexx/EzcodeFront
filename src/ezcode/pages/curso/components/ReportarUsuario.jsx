import React, { useEffect, useState } from 'react'
import { ChangeCursoNav } from '../../../components/ChangeCursoNav'
import { Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextareaAutosize, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import ezcodeApi from '../../../../api/ezcodeApi'
import Swal from 'sweetalert2'

export const ReportarUsuario = () => {
    const tipo = localStorage.getItem('tipo')
    const { idCurso } = useParams();
    const [profesor, setProfesor] = useState();
    const [alumno, setAlumno] = useState();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        tipo: '',
        motivo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ezcodeApi.get(`curso/${idCurso}`);
                const courseDataFromServer = response.data.curso;

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

    const reportarProfe = async (e) => {
        e.preventDefault();

        try {
            const response = await ezcodeApi.post(`profesor/reporte/${profesor.uid}/${idCurso}`, formData);
            if (response) {
                const reporte = response.data;
                sumarPuntosProfe(reporte);
                Swal.fire({
                    title: 'Usuario Reportado',
                    text: 'Se envió el reporte al administrador para su revision',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(-1);
                    }
                });
            }
        } catch (error) {
            console.log(error)
        }
    };

    const reportarAlumno = async (e) => {
        e.preventDefault();

        try {
            const response = await ezcodeApi.post(`user/reporte/${alumno.uid}/${idCurso}`, formData);
            if (response) {
                const reporte = response.data;
                sumarPuntosAlumno(reporte);
                Swal.fire({
                    title: 'Usuario Reportado',
                    text: 'Se envió el reporte al administrador para su revision',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(-1);
                    }
                });
            }
        } catch (error) {
            console.log(error)
        }
    };

    const sumarPuntosProfe = async (reporte) => {
        if (reporte.tipo === "Contenidos incompletos") {

            const puntosNuevos = 3;
            await ezcodeApi.put(`profesor/reportePuntos/${profesor.uid}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Conducta inadecuada y ofensiva") {
            const puntosNuevos = 3;
            await ezcodeApi.put(`profesor/reportePuntos/${profesor.uid}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Nulo conocimiento de los temas") {
            const puntosNuevos = 5;
            await ezcodeApi.put(`profesor/reportePuntos/${profesor.uid}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Contenido inapropiado") {
            const puntosNuevos = 5;
            await ezcodeApi.put(`profesor/reportePuntos/${profesor.uid}`, { puntos: puntosNuevos });
        }
    }

    const sumarPuntosAlumno = async (reporte) => {
        if (reporte.tipo === "Conducta inadecuada y ofensiva") {
            const puntosNuevos = 3;
            await ezcodeApi.put(`user/reportePuntos/${alumno.uid}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Inasistencia en el curso") {
            const puntosNuevos = 1;
            await ezcodeApi.put(`user/reportePuntos/${alumno.uid}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Incumplimiento o Desinterés en el curso") {
            const puntosNuevos = 1;
            await ezcodeApi.put(`user/reportePuntos/${alumno.uid}`, { puntos: puntosNuevos });
        }
    }

    return (
        <div className="back">
            <ChangeCursoNav />
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '100vh', padding: 4 }}
            >
                <Grid item
                    className='box-shadow'
                    xs={3}
                    sx={{
                        width: { sm: 450 },
                        backgroundColor: 'white',
                        padding: 3,
                        borderRadius: 2
                    }}>
                    {tipo === "Alumno" ? (
                        <div>
                            <Typography variant='h5' sx={{ mb: 1 }}>Reportar Profesor</Typography>
                            <form onSubmit={reportarProfe}>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Tipo</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="tipo"
                                            onChange={handleChange}
                                            value={formData.tipo}
                                        >
                                            <FormControlLabel value="Contenidos incompletos" control={<Radio />} label="Contenidos incompletos" />
                                            <FormControlLabel value="Conducta inadecuada y ofensiva" control={<Radio />} label="Conducta inadecuada y ofensiva" />
                                            <FormControlLabel value="Nulo conocimiento de los temas" control={<Radio />} label="Nulo conocimiento de los temas" />
                                            <FormControlLabel value="Contenido inapropiado" control={<Radio />} label="Contenido inapropiado" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <FormControl fullWidth>
                                    <label >Motivo</label>
                                    <TextareaAutosize
                                        onChange={handleChange}
                                        name="motivo"
                                        id="motivo"
                                        color="neutral"
                                        autoComplete='off'
                                        value={formData.motivo}
                                        minRows={10}
                                        maxRows={10}
                                        style={{ fontFamily: 'Arial', fontSize: '16px', resize: 'none', width: '100%' }}
                                        required
                                    />
                                </FormControl>
                                <br />
                                <br />
                                <Button type="submit" variant="contained" color="secondary">
                                    Reportar
                                </Button>
                                <Button onClick={() => navigate(-1)} color="primary">
                                    Volver
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <Typography variant='h5' sx={{ mb: 1 }}>Reportar Alumno</Typography>
                            <form onSubmit={reportarAlumno}>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Tipo</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="tipo"
                                            onChange={handleChange}
                                            value={formData.tipo}
                                        >
                                            <FormControlLabel value="Conducta inadecuada y ofensiva" control={<Radio />} label="Conducta inadecuada y ofensiva" />
                                            <FormControlLabel value="Inasistencia en el curso" control={<Radio />} label="Inasistencia en el curso" />
                                            <FormControlLabel value="Incumplimiento o Desinterés en el curso" control={<Radio />} label="Incumplimiento o Desinterés en el curso" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <FormControl fullWidth>
                                    <label >Motivo</label>
                                    <TextareaAutosize
                                        onChange={handleChange}
                                        name="motivo"
                                        id="motivo"
                                        color="neutral"
                                        autoComplete='off'
                                        value={formData.motivo}
                                        minRows={10}
                                        maxRows={10}
                                        style={{ fontFamily: 'Arial', fontSize: '16px', resize: 'none', width: '100%' }}
                                        required
                                    />
                                </FormControl>
                                <br />
                                <br />
                                <Button type="submit" variant="contained" color="secondary">
                                    Reportar
                                </Button>
                                <Button onClick={() => navigate(-1)} color="primary">
                                    Volver
                                </Button>
                            </form>
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}
