import { useState } from 'react';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';
import { Card } from '@/components/ui/card';
import type { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';

// todo: remove mock functionality
const mockConversations: Conversation[] = [
  {
    id: '1',
    itemId: '1',
    itemTitle: 'Blue iPhone 14 Pro',
    participants: ['1', '2'],
    lastMessage: {
      id: 'm1',
      conversationId: '1',
      senderId: '2',
      senderName: 'Maria Santos',
      content: 'Hi! Can you describe any unique features of the phone?',
      timestamp: new Date('2024-12-11T15:30:00'),
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: '2',
    itemId: '3',
    itemTitle: 'Silver MacBook Charger',
    participants: ['1', '4'],
    lastMessage: {
      id: 'm2',
      conversationId: '2',
      senderId: '1',
      senderName: 'Juan Dela Cruz',
      content: 'Thank you! I can pick it up tomorrow.',
      timestamp: new Date('2024-12-10T10:00:00'),
      read: true,
    },
    unreadCount: 0,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1-1',
      conversationId: '1',
      senderId: '1',
      senderName: 'Juan Dela Cruz',
      content: 'Hi, I believe this is my phone. I lost it yesterday near CCS.',
      timestamp: new Date('2024-12-11T14:00:00'),
      read: true,
    },
    {
      id: 'm1-2',
      conversationId: '1',
      senderId: '2',
      senderName: 'Maria Santos',
      content: 'Hi! Can you describe any unique features of the phone?',
      timestamp: new Date('2024-12-11T15:30:00'),
      read: false,
    },
  ],
  '2': [
    {
      id: 'm2-1',
      conversationId: '2',
      senderId: '4',
      senderName: 'Ana Garcia',
      content: 'I found your charger in room 301. You can pick it up anytime.',
      timestamp: new Date('2024-12-09T16:00:00'),
      read: true,
    },
    {
      id: 'm2-2',
      conversationId: '2',
      senderId: '1',
      senderName: 'Juan Dela Cruz',
      content: 'Thank you so much! What time are you available?',
      timestamp: new Date('2024-12-09T16:30:00'),
      read: true,
    },
    {
      id: 'm2-3',
      conversationId: '2',
      senderId: '4',
      senderName: 'Ana Garcia',
      content: 'I\'m usually there from 9am to 5pm.',
      timestamp: new Date('2024-12-10T09:00:00'),
      read: true,
    },
    {
      id: 'm2-4',
      conversationId: '2',
      senderId: '1',
      senderName: 'Juan Dela Cruz',
      content: 'Thank you! I can pick it up tomorrow.',
      timestamp: new Date('2024-12-10T10:00:00'),
      read: true,
    },
  ],
};

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;
    
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: '1',
      senderName: 'Juan Dela Cruz',
      content,
      timestamp: new Date(),
      read: true,
    };
    
    setMessages([...messages, newMessage]);
    console.log('Message sent:', content);
  };

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
      <h1 className="text-xl font-bold mb-4">Messages</h1>

      <div className="flex h-full gap-4">
        <Card className={cn(
          "overflow-hidden",
          selectedConversation ? "hidden md:block md:w-80" : "w-full md:w-80"
        )}>
          <ConversationList
            conversations={mockConversations}
            selectedId={selectedConversation?.id}
            onSelect={handleSelectConversation}
          />
        </Card>

        {selectedConversation ? (
          <Card className="flex-1 overflow-hidden">
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={() => setSelectedConversation(null)}
              showBackButton={true}
            />
          </Card>
        ) : (
          <Card className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
            <p>Select a conversation to start messaging</p>
          </Card>
        )}
      </div>
    </div>
  );
}
