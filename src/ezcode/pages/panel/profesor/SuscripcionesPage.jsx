import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProfeNav } from '../../../components/ProfeNav'
import ezcodeApi from '../../../../api/ezcodeApi';
import { Typography } from '@mui/material';

export const SuscripcionesPage = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.uid;

    const [anuncios, setAnuncios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ezcodeApi.get(`profesor/${userId}`);
                const userDataFromServer = response.data.profesor;
                if (userDataFromServer) {
                    try {
                        const anunciosResponse = await ezcodeApi.get(`busqueda/anuncios/${userDataFromServer.correo}`);
                        setAnuncios(anunciosResponse.data.results);
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

    const dataForChart = anuncios.map(anuncio => ({
        nombreAnuncio: anuncio.nombre,
        suscripciones: anuncio.suscripciones,
    }));

    return (
        <div>
            <ProfeNav />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <br />
                <Typography variant="h6" gutterBottom>
                    Suscripciones por Anuncio
                </Typography>
                <br />
                <hr />
                <br />
                <ResponsiveContainer width="50%" height={600}>
                    <BarChart data={dataForChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombreAnuncio" tick={false} angle={0} interval={0} textAnchor="end" height={100} style={{ overflow: 'visible' }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar type="monotone" dataKey="suscripciones" stroke="#000000" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
