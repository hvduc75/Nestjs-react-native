import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Hoặc chỉ định domain cụ thể, ví dụ: ['http://localhost:3000']
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  export class GatewayService
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer()
    server: Server;
  
    afterInit(server: Server) {
      console.log('WebSocket Gateway Initialized');
    }
  
    public userSocketMap = new Map<number, string>();
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      client.on('register', (data: { userId: number }) => {
        try {
          console.log('Register event received:', data);
          this.userSocketMap.set(data.userId, client.id);
          console.log(`Registered user ${data.userId} with socket ${client.id}`);
        } catch (error) {
          console.error('Error handling register event:', error);
        }
      });
    }
  
    handleDisconnect(client: Socket) {
      client.on('disconnect', () => {
        for (const [userId, socketId] of this.userSocketMap.entries()) {
          if (socketId === client.id) {
            this.userSocketMap.delete(userId);
            break;
          }
        }
        console.log(`Client disconnected: ${client.id}`);
      });
    }
  
    // Gửi thông báo đến tất cả client
    broadcastEvent(event: string, payload: any) {
      this.server.emit(event, payload);
    }
  
    // Gửi thông báo đến một client cụ thể
    sendToClient(clientId: string, event: string, payload: any) {
      const client = this.server.sockets.sockets.get(clientId);
      if (client) {
        client.emit(event, payload);
      }
    }
  }