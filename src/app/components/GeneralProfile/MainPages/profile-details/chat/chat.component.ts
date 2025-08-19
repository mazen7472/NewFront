import { Component, OnInit, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface ChatMessage {
  id: string;
  senderUserId: string;
  receiverUserId: string;
  senderName: string;
  receiverName: string;
  messageText: string;
  sentAt: Date;
  isRead: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, UpperCasePipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  hubConnection!: signalR.HubConnection;
  connectionState: string = 'Disconnected';

  myUserId: string = 'userA'; // 👈 replace with real logged-in user id

  messages: ChatMessage[] = [];
  typingUser: string | null = null;
  newMessage: string = '';
  receiverUserId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.receiverUserId = params.get('id') || '';
      if (this.receiverUserId) {
        this.startConnection();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7230/chat', {
        accessTokenFactory: () => localStorage.getItem('userToken') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onreconnecting(() => (this.connectionState = 'Reconnecting...'));
    this.hubConnection.onreconnected(() => (this.connectionState = 'Connected'));
    this.hubConnection.onclose(() => (this.connectionState = 'Disconnected'));

    this.hubConnection
      .start()
      .then(() => {
        this.connectionState = 'Connected';
        console.log('✅ Connected to ChatHub');
        this.loadHistory();
      })
      .catch(err => console.error('❌ Error connecting to hub:', err));

    // ✅ listen for messages
    this.hubConnection.on('ReceivePrivateMessage', (message: ChatMessage) => {
      this.messages.push({
        ...message,
        sentAt: new Date(message.sentAt) // ensure correct type
      });
    });

    // ✅ typing event
    this.hubConnection.on('UserTyping', (senderId: string) => {
      if (senderId !== this.myUserId) {
        this.typingUser = senderId;
        setTimeout(() => (this.typingUser = null), 2000);
      }
    });
  }

  loadHistory() {
    if (!this.receiverUserId) return;
    this.hubConnection
      .invoke<ChatMessage[]>('GetMessageHistory', this.receiverUserId, 20)
      .then(history => {
        this.messages = history;
      })
      .catch(err => console.error('❌ Failed to load history:', err));
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.receiverUserId) return;
    this.hubConnection
      .invoke('SendPrivateMessage', this.receiverUserId, this.newMessage)
      .catch(err => console.error('❌ Send error:', err));
    this.newMessage = '';
  }

  sendTyping() {
    if (!this.receiverUserId) return;
    this.hubConnection.invoke('SendTyping', this.receiverUserId).catch(() => {});
  }
}