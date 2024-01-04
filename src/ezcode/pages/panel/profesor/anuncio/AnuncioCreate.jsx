import { Grid, TextField, Typography, FormControl, Button, TextareaAutosize, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material'
import ezcodeApi from '../../../../../api/ezcodeApi'
import { ProfeNav } from '../../../../components/ProfeNav'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';

export const AnuncioCreate = () => {
    const navigate = useNavigate()

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
        precio: false,
    });

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
                const response = await ezcodeApi.post('anuncio/', formData);
                const anuncioDataFromServer = response.data;
                if (anuncioDataFromServer) {
                    try {
                        await ezcodeApi.post('solicitudA/', { anuncio: anuncioDataFromServer.uid });
                    } catch (error) {
                        console.log(error)
                    }
                }
                Swal.fire({
                    title: 'Anuncio creado con éxito',
                    text: 'Se envió una solicitud al administrador para su revision',
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'precio' ? parseFloat(value) : value,
        }));
    };


    return (
        <div >
            <ProfeNav />
            <div className='back'>
                <Grid container spacing={0} style={{ height: '100vh' }} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={4} style={{ border: '1px solid', borderColor: '#ccc', padding: '20px', borderRadius: '10px', backgroundColor: 'white' }}>
                        <Typography variant="h6" gutterBottom>
                            Crea tu Anuncio
                        </Typography>
                        <p>Si quieres agregarle una imagen, edita el anuncio en el panel de tu cuenta</p>
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
                                <label >Descripción</label>
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
                            <TextField
                                label="Precio"
                                name="precio"
                                type='number'
                                value={formData.precio}
                                fullWidth
                                margin="normal"
                                onChange={handleChange}
                                error={formErrors.precio}
                                helperText={formErrors.precio && 'El precio es obligatorio'}
                            />
                            <Button type="submit" variant="contained" color="secondary">
                                Crear Anuncio
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
