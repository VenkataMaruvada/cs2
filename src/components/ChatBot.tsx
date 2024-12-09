import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatService } from '../services/chat.service';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const waitingMessages = [
  'Our virtual shelves are being dusted for you—hang tight!',
  'Scanning the aisles for your perfect product—just a moment!',
  'Our retail bots are on it! Your request is coming soon.',
  'Picking the best options from our digital inventory—please wait!',
  'We’re finding the perfect match for your style—hold on!',
  'Sorting through our catalog faster than a checkout scanner—almost there!',
  'Your shopping assistant is fetching the finest items—stay tuned!',
  'Unpacking top recommendations for you—just a sec!',
  'Our carts are rolling toward your answer—thanks for waiting!',
  'We’re tailoring a response to fit your needs perfectly!',
  'Sweeping through the stockroom to bring you the best—hang on!',
  'Clicking through virtual aisles to find what you’re looking for!',
  'Your personal shopper is assembling the options—please bear with us.',
  'We’re putting together the perfect shopping list—hold tight!',
  'Our AI assistant is tying the bow on your request—one moment!',
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today?', isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentWaitingMessage, setCurrentWaitingMessage] = useState(
    waitingMessages[0]
  );
  const [showBouncingDots, setShowBouncingDots] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let messageInterval: NodeJS.Timeout | null = null;

    if (isWaiting) {
      // Show waiting messages after 3 seconds of bouncing dots
      setTimeout(() => setShowBouncingDots(false), 3000);

      messageInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * waitingMessages.length);
        setCurrentWaitingMessage(waitingMessages[randomIndex]);
      }, 3000);
    } else {
      setShowBouncingDots(true); // Reset for the next interaction
      if (messageInterval) clearInterval(messageInterval);
    }

    return () => {
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [isWaiting]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsWaiting(false);

    const waitingTimer = setTimeout(() => {
      setIsWaiting(true);
    }, 5000);

    try {
      const chatResponse = await ChatService.sendMessage(input);
      clearTimeout(waitingTimer);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: chatResponse.response, isBot: true },
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      clearTimeout(waitingTimer);
    } finally {
      setIsLoading(false);
      setIsWaiting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-[650px] h-[650px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <span className="font-semibold text-lg">Conversational Search</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isBot ? 'items-start' : 'items-end justify-end'
                }`}
              >
                {message.isBot && (
                  <img
                    src="https://p.turbosquid.com/ts-thumb/Hw/tlqDzk/QI/0000/jpg/1622119921/1920x1080/turn_fit_q99/d70a25c6a48b54ccad679024bd39446c8b9a56d7/0000-1.jpg"
                    alt="Assistant"
                    className="w-15 h-10 rounded-full mr-3"
                  />
                )}
                <div
                  className={`flex flex-col ${
                    message.isBot ? 'items-start' : 'items-end'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      message.isBot ? 'text-gray-600' : 'text-blue-600'
                    }`}
                  >
                    {message.isBot ? 'Assistant' : 'You'}
                  </span>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                    style={{ maxWidth: '95%' }}
                  >
                    {message.text}
                  </div>
                </div>
                {!message.isBot && (
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/034/324/148/small_2x/front-view-of-an-animated-boy-standing-wearing-tshirt-character-design-free-photo.jpeg"
                    alt="User"
                    className="w-15 h-10 rounded-full ml-3 relative -top-11"
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-4">
                <img
                  src="https://p.turbosquid.com/ts-thumb/Hw/tlqDzk/QI/0000/jpg/1622119921/1920x1080/turn_fit_q99/d70a25c6a48b54ccad679024bd39446c8b9a56d7/0000-1.jpg"
                  alt="Assistant"
                  className="w-15 h-10 rounded-full mr-3"
                />
                {showBouncingDots ? (
                  <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                ) : (
                  <div className="text-center mt-4">
                    <p className="text-gray-500 text-lg font-semibold animate-pulse">
                      {currentWaitingMessage}
                    </p>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
