// Updated ChatBot.jsx with all three features implemented
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import FeedbackComponent from './FeedbackComponent';
import { translations } from './translation';
import { GoogleGenAI } from "@google/genai";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [language, setLanguage] = useState('en'); // Default language is English
  const [feedbackData, setFeedbackData] = useState([]); // Store feedback data

  // Replace with your actual Gemini API key
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add welcome message when opening for the first time
      setMessages([
        {
          id: generateMessageId(),
          text: translations[language].welcomeMessage,
          sender: 'bot'
        }
      ]);
    }
  };

  const generateMessageId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'sw' : 'en';
    setLanguage(newLanguage);
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

    setFeedbackData(prev => [...prev, newFeedback]);

    // Here you would typically send this feedback to your server
    // For now, we'll just log it to console
    console.log('Feedback received:', newFeedback);

    // In a real application, you might want to send this to your backend:
    // Example:
    // axios.post('https://your-api.com/feedback', newFeedback)
    //   .then(response => console.log('Feedback sent successfully'))
    //   .catch(error => console.error('Error sending feedback:', error));
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
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

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Format the request according to Gemini API requirements
      const prompt = {
        contents: [
          {
            role: "system",
            parts: [{
              text: `You are a specialized mental health assistant for GetActive Kenya.

              Guidelines:
              - Be empathetic and supportive for people with anxiety, depression, and stress
              - Provide culturally appropriate advice for Kenyan context
              - Suggest physical activities and mental health practices based on GetActive Kenya's programs
              - Never diagnose conditions or replace professional help
              - Always encourage seeking professional support for serious concerns
              - Include relevant GetActive Kenya resources when appropriate

              ${language === 'sw' ? 'Respond in Swahili.' : 'Respond in English.'}`
            }]
          },
          ...conversationHistory,
          {
            role: "user",
            parts: [{ text: input }]
          }
        ]
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        prompt,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract response text from Gemini API
      const botResponse = response.data.candidates[0].content.parts[0].text;

      setMessages(prev => [
        ...prev,
        {
          id: generateMessageId(),
          text: botResponse,
          sender: 'bot'
        }
      ]);
    } catch (error) {
      console.error('Error with Gemini API:', error);
      setMessages(prev => [
        ...prev,
        {
          id: generateMessageId(),
          text: translations[language].errorMessage,
          sender: 'bot'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
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
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.text}
                {message.sender === 'bot' && (
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

export default ChatBot;
