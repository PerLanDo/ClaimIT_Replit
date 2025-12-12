import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ConversationList } from "@/components/ConversationList";
import { ChatWindow } from "@/components/ChatWindow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Conversation, Message } from "@/lib/types";
import { cn } from "@/lib/utils";

// todo: remove mock functionality
const mockConversations: Conversation[] = [
  {
    itemId: "1",
    otherUserId: "2",
    lastMessage: {
      id: "m1",
      itemId: "1",
      senderId: "2",
      receiverId: "1",
      content: "Hi! Can you describe any unique features of the phone?",
      timestamp: new Date("2024-12-11T15:30:00"),
      isRead: false,
    },
  },
  {
    itemId: "3",
    otherUserId: "4",
    lastMessage: {
      id: "m2",
      itemId: "3",
      senderId: "1",
      receiverId: "4",
      content: "Thank you! I can pick it up tomorrow.",
      timestamp: new Date("2024-12-10T10:00:00"),
      isRead: true,
    },
  },
];

const mockMessages: Record<string, Message[]> = {
  "1-2": [
    {
      id: "m1-1",
      itemId: "1",
      senderId: "1",
      receiverId: "2",
      content: "Hi, I believe this is my phone. I lost it yesterday near CCS.",
      timestamp: new Date("2024-12-11T14:00:00"),
      isRead: true,
    },
    {
      id: "m1-2",
      itemId: "1",
      senderId: "2",
      receiverId: "1",
      content: "Hi! Can you describe any unique features of the phone?",
      timestamp: new Date("2024-12-11T15:30:00"),
      isRead: false,
    },
  ],
  "3-4": [
    {
      id: "m2-1",
      itemId: "3",
      senderId: "4",
      receiverId: "1",
      content: "I found your charger in room 301. You can pick it up anytime.",
      timestamp: new Date("2024-12-09T16:00:00"),
      isRead: true,
    },
    {
      id: "m2-2",
      itemId: "3",
      senderId: "1",
      receiverId: "4",
      content: "Thank you so much! What time are you available?",
      timestamp: new Date("2024-12-09T16:30:00"),
      isRead: true,
    },
    {
      id: "m2-3",
      itemId: "3",
      senderId: "4",
      receiverId: "1",
      content: "I'm usually there from 9am to 5pm.",
      timestamp: new Date("2024-12-10T09:00:00"),
      isRead: true,
    },
    {
      id: "m2-4",
      itemId: "3",
      senderId: "1",
      receiverId: "4",
      content: "Thank you! I can pick it up tomorrow.",
      timestamp: new Date("2024-12-10T10:00:00"),
      isRead: true,
    },
  ],
};

interface MessagesPageProps {
  onBack?: () => void;
}

export function MessagesPage({ onBack }: MessagesPageProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    const conversationKey = `${conversation.itemId}-${conversation.otherUserId}`;
    setMessages(mockMessages[conversationKey] || []);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      itemId: selectedConversation.itemId,
      senderId: "1",
      receiverId: selectedConversation.otherUserId,
      content,
      timestamp: new Date(),
      isRead: true,
    };

    setMessages([...messages, newMessage]);
    console.log("Message sent:", content);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] pb-16 md:pb-0 md:h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Messages</h1>
      </div>

      <div className="flex flex-1 min-h-0 gap-4">
        <Card
          className={cn(
            "overflow-hidden shadow-lg border-2",
            selectedConversation ? "hidden md:block md:w-96" : "w-full md:w-96"
          )}
        >
          <ConversationList
            conversations={mockConversations}
            selectedId={
              selectedConversation
                ? `${selectedConversation.itemId}-${selectedConversation.otherUserId}`
                : undefined
            }
            onSelect={handleSelectConversation}
          />
        </Card>

        {selectedConversation ? (
          <Card className="flex-1 overflow-hidden shadow-lg border-2">
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={() => setSelectedConversation(null)}
              showBackButton={true}
            />
          </Card>
        ) : (
          <Card className="hidden md:flex flex-1 items-center justify-center text-muted-foreground shadow-lg border-2">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
