// client/src/components/Chatbot.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import FeedbackComponent from './FeedbackComponent';
import { translations } from './translation';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [language, setLanguage] = useState('en'); // Default language is English

  // Define your backend API URL
  // Use a relative path if serving frontend and backend from the same domain/port in production
  // For development, use the full URL including port
  const BACKEND_API_URL = process.env.NODE_ENV === 'production'
    ? '/api/chatbot/generate-text' // Adjust this path if your server setup is different
    : `${process.env.REACT_APP_API_URL}/api/chatbot/generate-text`; // <-- Match your backend server URL and route

  // Load messages from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedLanguage = localStorage.getItem('chatLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('chatLanguage', language);
  }, [language]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateMessageId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Only add welcome message if chat is being opened AND it's a fresh conversation
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: generateMessageId(),
          text: translations[language].welcomeMessage,
          sender: 'bot'
        }
      ]);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'sw' : 'en';
    setLanguage(newLanguage);
    // Optionally update welcome message if language changes while chat is open and empty
    if (messages.length === 1 && messages[0].sender === 'bot' && messages[0].text === translations[language].welcomeMessage) {
        setMessages([
            {
                id: generateMessageId(),
                text: translations[newLanguage].welcomeMessage,
                sender: 'bot'
            }
        ]);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFeedback = (messageId, isHelpful, comment) => {
    const newFeedback = {
      messageId,
      isHelpful,
      comment,
      timestamp: new Date().toISOString()
    };

    console.log('Feedback received:', newFeedback);

    // In a real application, you would send this feedback to your server
    axios.post(`${process.env.REACT_APP_API_URL}/api/feedback`, newFeedback)
      .then(response => console.log('Feedback sent successfully'))
      .catch(error => console.error('Error sending feedback:', error));
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    // Add welcome message back after clearing if chat is open
    if (isOpen) {
      setMessages([
        {
          id: generateMessageId(),
          text: translations[language].welcomeMessage,
          sender: 'bot'
        }
      ]);
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const messageId = generateMessageId();
    const userMessage = {
      id: messageId,
      text: input,
      sender: 'user'
    };

    // Add user message to the UI immediately for responsiveness
    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear input field
    setIsLoading(true); // Show loading indicator

    try {
      // Prepare conversation history for the backend.
      // The backend expects an array of objects with 'role' and 'parts'.
      // This `messages` state already contains the previous user/bot messages.
      // We explicitly filter out any potential 'system' roles, though they shouldn't be here.
      const conversationHistoryForBackend = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Make the API call to your backend
      const response = await axios.post(
        BACKEND_API_URL,
        {
          // The current user input is sent under the 'prompt' key
          prompt: userMessage.text, // Use userMessage.text directly
          // The previous conversation history is sent under the 'chatHistory' key
          chatHistory: conversationHistoryForBackend,
          // The current language preference is sent
          language: language
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the generated text from your backend's response
      const botResponse = response.data.text;

      // Add the bot's response to the UI
      setMessages(prev => [
        ...prev,
        {
          id: generateMessageId(),
          text: botResponse,
          sender: 'bot'
        }
      ]);
    } catch (error) {
      console.error('Error communicating with backend:', error);

      // Construct an informative error message for the user
      const errorMessage = error.response && error.response.data && error.response.data.error
                           ? (typeof error.response.data.error === 'string' ? error.response.data.error : JSON.stringify(error.response.data.error))
                           : translations[language].errorMessage;

      // Display the error message in the chat
      setMessages(prev => [
        ...prev,
        {
          id: generateMessageId(),
          text: errorMessage,
          sender: 'bot',
          isError: true // Optional: Add a flag to style error messages differently
        }
      ]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && input.trim() !== '') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <button
              className="language-btn"
              onClick={toggleLanguage}
            >
              {translations[language].languageToggle}
            </button>
            <h3>{translations[language].chatHeader}</h3>
            <button
              className="clear-chat-btn"
              onClick={clearConversation}
            >
              🗑️
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                // Apply a different class for error messages if you added isError flag
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
              >
                {message.text}
                {message.sender === 'bot' && !message.isError && ( // Don't show feedback for error messages
                  <FeedbackComponent
                    messageId={message.id}
                    onSubmitFeedback={handleFeedback}
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={translations[language].inputPlaceholder}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || input.trim() === ''}
            >
              {translations[language].sendButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
