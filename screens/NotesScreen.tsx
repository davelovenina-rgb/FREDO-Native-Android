import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { Note } from '../types';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    saveNotes();
  }, [notes]);

  const loadNotes = async () => {
    try {
      const saved = await AsyncStorage.getItem('notes');
      if (saved) setNotes(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const createNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      timestamp: Date.now(),
    };
    setNotes(prev => [note, ...prev]);
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!selectedNote) return;
    setNotes(prev =>
      prev.map(note =>
        note.id === selectedNote.id
          ? { ...note, title: editTitle, content: editContent, timestamp: Date.now() }
          : note
      )
    );
    setIsEditing(false);
    setSelectedNote(null);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search notes..."
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      {/* Create Button */}
      <TouchableOpacity style={styles.createButton} onPress={createNote}>
        <Text style={styles.createButtonText}>+ New Note</Text>
      </TouchableOpacity>

      {/* Notes List */}
      <ScrollView style={styles.notesList}>
        {filteredNotes.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery ? 'No notes found.' : 'No notes yet. Create your first one!'}
          </Text>
        ) : (
          filteredNotes.map(note => (
            <TouchableOpacity
              key={note.id}
              style={styles.noteCard}
              onPress={() => {
                setSelectedNote(note);
                setEditTitle(note.title);
                setEditContent(note.content);
                setIsEditing(true);
              }}
            >
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNote(note.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.notePreview} numberOfLines={2}>
                {note.content || 'Empty note'}
              </Text>
              <Text style={styles.noteDate}>
                {new Date(note.timestamp).toLocaleDateString()} •{' '}
                {new Date(note.timestamp).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveEdit}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.titleInput}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Note title..."
            placeholderTextColor={COLORS.textSecondary}
          />
          <TextInput
            style={styles.contentInput}
            value={editContent}
            onChangeText={setEditContent}
            placeholder="Start writing..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  createButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noteCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  notePreview: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  noteDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCancel: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  modalSave: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleInput: {
    padding: 16,
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contentInput: {
    flex: 1,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
