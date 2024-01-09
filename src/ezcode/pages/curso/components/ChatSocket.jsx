import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client';
import ezcodeApi from '../../../../api/ezcodeApi';

const socket = io("http://localhost:8080");

export const ChatSocket = ({ id }) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.uid;

    const [mensaje, setMensaje] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('connection', () => {
            console.log('Conectado al servidor de Socket.io');
        });

        socket.on('disconnect', () => {
            console.log('Desconectado del servidor de Socket.io');
        });

        socket.on('user joined', (joinedUserId) => {
            console.log(`Usuario ${joinedUserId} se unió al curso`);
        });

        socket.on('chat message', (data) => {
            setMessages((prevMessages) => [...(prevMessages || []), data]);
        });

        const loadChatHistory = async () => {
            try {
                const response = await ezcodeApi.get(`curso/${id}`);

                if (response.status === 200) {
                    setMessages(response.data.curso.historialMensajes);
                } else {
                    console.error('Error al cargar el historial de mensajes:', response.statusText);
                }
            } catch (error) {
                console.error('Error al cargar el historial de mensajes:', error.message);
            }
        };

        socket.emit('join course', { token: token, courseId: id });

        loadChatHistory();

        return () => {
            socket.off('user joined');
            socket.off('chat message');
        };
    }, [id, token]);

    const sendMessage = () => {
        if (mensaje.trim() !== '') {
            console.log('Enviando mensaje:', mensaje);
            socket.emit('chat message', { courseId: id, message: mensaje, token: token });
            setMensaje('');
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <Grid container>
            <Typography variant="h6" style={{ color: 'white' }}>Chat del Curso</Typography>
            <br />
            <br />
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <div style={{ height: '400px', overflowY: 'auto' }}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    textAlign: message.usuarioId === userId ? 'right' : 'left',
                                    backgroundColor: message.usuarioId === userId ? '#e0e0e0' : '#b0b0b0',
                                    padding: '8px',
                                    margin: '10px 0',
                                    borderRadius: '8px',
                                    maxWidth: '50%',
                                    marginLeft: message.usuarioId === userId ? 'auto' : 'unset',
                                    marginRight: message.usuarioId === userId ? 'unset' : 'auto',
                                }}
                            >
                                <div>
                                    <strong>{message.userName}:</strong> {message.message}
                                </div>
                                <div style={{ fontSize: '0.8em', color: '#777' }}>
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                </Paper>
            </Grid>
            <div style={{ marginTop: '10px', display: 'flex', width: '100%', alignItems: 'center' }}>
                <TextField
                    autoComplete='off'
                    label="Mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    style={{ flex: 1, marginRight: '8px', backgroundColor: 'white', borderRadius: '8px' }}
                />
                <IconButton color="primary" onClick={sendMessage} style={{ color: 'white' }}>
                    <SendIcon />
                </IconButton>
            </div>
        </Grid>
    );
};