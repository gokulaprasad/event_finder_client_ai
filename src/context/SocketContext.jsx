import { createContext, useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  setSocket,
  addMessage,
  setMessages,
  setOnlineCount,
  userJoined,
  userLeft,
  setTyping,
  setError,
} from '../redux/slices/chatSlice';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { currentEventId } = useSelector((state) => state.chat);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        dispatch(setSocket(true));
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
        dispatch(setSocket(false));
      });

      socketRef.current.on('error', (error) => {
        dispatch(setError(error.message));
      });

      // Chat event listeners
      socketRef.current.on('previous-messages', (messages) => {
        dispatch(setMessages(messages));
      });

      socketRef.current.on('new-message', (message) => {
        dispatch(addMessage(message));
      });

      socketRef.current.on('online-count', (count) => {
        dispatch(setOnlineCount(count));
      });

      socketRef.current.on('user-joined', (userData) => {
        dispatch(userJoined(userData));
      });

      socketRef.current.on('user-left', (userData) => {
        dispatch(userLeft(userData));
      });

      socketRef.current.on('user-typing', ({ userId, isTyping }) => {
        dispatch(setTyping({ userId, isTyping }));
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isAuthenticated, user, dispatch]);

  const joinEvent = (eventId) => {
    if (socketRef.current && user) {
      socketRef.current.emit('join-event', { eventId, userId: user._id });
    }
  };

  const sendMessage = (eventId, message) => {
    if (socketRef.current && user) {
      socketRef.current.emit('send-message', {
        eventId,
        userId: user._id,
        message,
      });
    }
  };

  const sendTyping = (eventId, isTyping) => {
    if (socketRef.current && user) {
      socketRef.current.emit('typing', {
        eventId,
        userId: user._id,
        isTyping,
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        joinEvent,
        sendMessage,
        sendTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
