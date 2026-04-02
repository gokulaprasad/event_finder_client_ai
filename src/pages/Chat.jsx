import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Users,
  MoreVertical,
  Smile,
  Paperclip,
} from 'lucide-react';
import { getEventById } from '../redux/slices/eventSlice';
import { setCurrentEvent, clearChat } from '../redux/slices/chatSlice';
import { useSocket } from '../context/SocketContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Chat = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { joinEvent, sendMessage, sendTyping } = useSocket();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { currentEvent } = useSelector((state) => state.events);
  const { messages, onlineCount, isTyping, isConnected } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);

  const [messageInput, setMessageInput] = useState('');
  const [isJoining, setIsJoining] = useState(true);

  // Fetch event details and join chat
  useEffect(() => {
    dispatch(getEventById(eventId));
    dispatch(setCurrentEvent(eventId));

    // Join chat room
    const timer = setTimeout(() => {
      if (isConnected) {
        joinEvent(eventId);
        setIsJoining(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      dispatch(clearChat());
    };
  }, [dispatch, eventId, joinEvent, isConnected]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(eventId, messageInput);
    setMessageInput('');
    sendTyping(eventId, false);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Send typing indicator
    sendTyping(eventId, true);

    // Clear typing indicator after delay
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(eventId, false);
    }, 2000);
  };

  const isUserMessage = (message) => {
    return message.sender?._id === user?._id;
  };

  if (isJoining) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Joining chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/events/${eventId}`}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white">
                  {currentEvent?.title || 'Event Chat'}
                </h1>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{onlineCount} online</span>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-primary rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to {currentEvent?.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This is the beginning of the event chat. Connect with other attendees!
            </p>
          </div>

          {/* Message List */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`flex ${
                  isUserMessage(message) ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    isUserMessage(message)
                      ? 'bg-gradient-primary text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  } rounded-2xl px-4 py-3 shadow-sm`}
                >
                  {!isUserMessage(message) && (
                    <p className="text-xs font-medium text-green-300 mb-1">
                      {message.sender?.name}
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isUserMessage(message)
                        ? 'text-white/70'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {format(new Date(message.timestamp || message.createdAt), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {isTyping.length > 0 && (
            <div className="flex justify-start mt-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-3 bg-gradient-primary text-white rounded-full hover:bg-gradient-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
