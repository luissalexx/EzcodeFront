import React, { useEffect, useState } from 'react'
import { ClienteNav } from '../../../components/ClienteNav'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import ezcodeApi from '../../../../api/ezcodeApi';

export const CalificacionesPage = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.uid;

    const [cursos, setCursos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ezcodeApi.get(`user/${userId}`);
                const userDataFromServer = response.data.alumno;
                if (userDataFromServer) {
                    try {
                        const cursosResponse = await ezcodeApi.get(`busqueda/cursos/${userDataFromServer.correo}`);
                        setCursos(cursosResponse.data.results);
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

    const dataForChart = cursos.map(curso => ({
        nombreCurso: curso.nombre,
        calificacion: curso.calificacion,
    }));

    return (
        <div>

            <ClienteNav />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <br />
                <Typography variant="h6" gutterBottom>
                    Calificaciones por Curso
                </Typography>
                <br />
                <hr />
                <br />
                <ResponsiveContainer width="50%" height={600}>
                    <BarChart data={dataForChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombreCurso" angle={0} interval={0} textAnchor="end" height={100} style={{ overflow: 'visible' }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar type="monotone" dataKey="calificacion" stroke="#000000" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
