import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: 'http://127.0.0.1:5501',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class UserGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log('WebSocket server initialized');
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): void {
        this.server.emit('message', payload);
    }

    sendUserCreated(user: any) {
        this.server.emit('userCreated', user);
    }
}

