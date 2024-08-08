import { Server } from "socket.io";

let io: any;

export const initSocket = (server: any) => {
    if (!io) {
        io = new Server(server, {
            path: '/api/socket',
        });

        io.on('connection', (socket: any) => {
            console.log('Пользователь подключен: ', socket.id);

            socket.on('disconnect', () => {
                console.log('Пользователь отключен: ', socket.id);
            });
        });
    }

    return io;
};

export const getIO = () => {
    if (!io) throw new Error('Socket.io не инициализирован');
    return io;
};