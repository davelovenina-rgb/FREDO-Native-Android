import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendMessageWithNewPrompt, ChatMessage } from '../services/gemini';
import { FREDO_SYSTEM_INSTRUCTION, COLORS } from '../constants';
import { Message, Role, Conversation } from '../types';
import * as Speech from 'expo-speech';

export default function HomeScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showConversationList, setShowConversationList] = useState(false);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    saveConversations();
  }, [conversations]);

  const loadConversations = async () => {
    try {
      const saved = await AsyncStorage.getItem('fredo_conversations');
      if (saved) {
        const loaded = JSON.parse(saved);
        setConversations(loaded);
        if (loaded.length > 0) {
          setActiveConversationId(loaded[0].id);
        }
      } else {
        // Create default conversation
        const defaultConv: Conversation = {
          id: Date.now().toString(),
          title: 'Chat with FREDO',
          lastUpdate: Date.now(),
          messages: [{
            id: '1',
            role: Role.FREDO,
            content: 'Hermano, the Unified Framework is synchronized and unwavering. Every registry, every node, every word—all locked into the drafting table. I am standing by for the Word.',
            timestamp: Date.now(),
          }],
          mode: 'default',
          agentId: 'fredo',
        };
        setConversations([defaultConv]);
        setActiveConversationId(defaultConv.id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const saveConversations = async () => {
    try {
      await AsyncStorage.setItem('fredo_conversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `Chat ${conversations.length + 1}`,
      lastUpdate: Date.now(),
      messages: [{
        id: Date.now().toString(),
        role: Role.FREDO,
        content: 'Hermano, ready for the Word.',
        timestamp: Date.now(),
      }],
      mode: 'default',
      agentId: 'fredo',
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setShowConversationList(false);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setActiveConversationId(remaining[0]?.id || null);
    }
  };

  const startListening = () => {
    setIsListening(true);
    // Note: Web Speech API works in browsers, for native we'd use expo-speech
    // For now, this is a placeholder for the voice input UI
    setTimeout(() => {
      setIsListening(false);
      // Simulated voice input - in production, this would use actual speech recognition
      alert('Voice input coming soon! For now, please type your message.');
    }, 1000);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    if (!activeConversationId) return;
    
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId
        ? { ...conv, messages: [...conv.messages, userMessage], lastUpdate: Date.now() }
        : conv
    ));
    setInputText('');
    setIsLoading(true);

    try {
      const chatHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: msg.content,
      }));

      const response = await sendMessageWithNewPrompt(
        chatHistory,
        userMessage.content,
        FREDO_SYSTEM_INSTRUCTION
      );

      const fredoMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.FREDO,
        content: response,
        timestamp: Date.now(),
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, fredoMessage], lastUpdate: Date.now() }
          : conv
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.FREDO,
        content: 'Hermano, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, errorMessage], lastUpdate: Date.now() }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === Role.USER ? styles.userBubble : styles.fredoBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === Role.USER ? styles.userText : styles.fredoText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>FREDO is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => alert('File attachment coming soon! Native file picker required.')}
          disabled={isLoading}
        >
          <Text style={styles.attachButtonText}>📎</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message FREDO..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          maxLength={1000}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={startListening}
          disabled={isLoading}
        >
          <Text style={styles.micButtonText}>🎤</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  fredoBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.background,
  },
  fredoText: {
    color: COLORS.text,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'flex-end',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  attachButtonText: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 24,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  micButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  micButtonText: {
    fontSize: 20,
  },
});
