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
import { NeuralMemory } from '../types';

export default function MemoriesScreen() {
  const [memories, setMemories] = useState<NeuralMemory[]>([]);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [editingMemory, setEditingMemory] = useState<NeuralMemory | null>(null);
  const [newMemory, setNewMemory] = useState({
    title: '',
    instructions: '',
  });

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    saveMemories();
  }, [memories]);

  const loadMemories = async () => {
    try {
      const saved = await AsyncStorage.getItem('neural_memories');
      if (saved) setMemories(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading memories:', error);
    }
  };

  const saveMemories = async () => {
    try {
      await AsyncStorage.setItem('neural_memories', JSON.stringify(memories));
    } catch (error) {
      console.error('Error saving memories:', error);
    }
  };

  const addMemory = () => {
    if (!newMemory.title.trim() || !newMemory.instructions.trim()) return;

    const memory: NeuralMemory = {
      id: Date.now().toString(),
      title: newMemory.title.trim(),
      instructions: newMemory.instructions.trim(),
      timestamp: Date.now(),
    };

    setMemories(prev => [memory, ...prev]);
    setNewMemory({ title: '', instructions: '' });
    setShowAddMemory(false);
  };

  const updateMemory = () => {
    if (!editingMemory || !newMemory.title.trim() || !newMemory.instructions.trim())
      return;

    setMemories(prev =>
      prev.map(mem =>
        mem.id === editingMemory.id
          ? {
              ...mem,
              title: newMemory.title.trim(),
              instructions: newMemory.instructions.trim(),
              timestamp: Date.now(),
            }
          : mem
      )
    );
    setEditingMemory(null);
    setNewMemory({ title: '', instructions: '' });
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(mem => mem.id !== id));
  };

  const startEdit = (memory: NeuralMemory) => {
    setEditingMemory(memory);
    setNewMemory({ title: memory.title, instructions: memory.instructions });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Neural Memories</Text>
        <Text style={styles.headerSubtitle}>
          Custom instructions for FREDO to remember
        </Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddMemory(true)}
      >
        <Text style={styles.addButtonText}>+ New Memory</Text>
      </TouchableOpacity>

      {/* Memories List */}
      <ScrollView style={styles.memoriesList}>
        {memories.length === 0 ? (
          <Text style={styles.emptyText}>
            No memories yet. Add custom instructions for FREDO!
          </Text>
        ) : (
          memories.map(memory => (
            <View key={memory.id} style={styles.memoryCard}>
              <View style={styles.memoryHeader}>
                <Text style={styles.memoryTitle}>{memory.title}</Text>
                <View style={styles.memoryActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => startEdit(memory)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteMemory(memory.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.memoryInstructions} numberOfLines={3}>
                {memory.instructions}
              </Text>
              <Text style={styles.memoryDate}>
                {new Date(memory.timestamp).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddMemory || editingMemory !== null}
        animationType="slide"
        onRequestClose={() => {
          setShowAddMemory(false);
          setEditingMemory(null);
          setNewMemory({ title: '', instructions: '' });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowAddMemory(false);
                setEditingMemory(null);
                setNewMemory({ title: '', instructions: '' });
              }}
            >
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingMemory ? 'Edit Memory' : 'New Memory'}
            </Text>
            <TouchableOpacity
              onPress={editingMemory ? updateMemory : addMemory}
            >
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.formLabel}>Title:</Text>
            <TextInput
              style={styles.titleInput}
              value={newMemory.title}
              onChangeText={title => setNewMemory({ ...newMemory, title })}
              placeholder="Memory title..."
              placeholderTextColor={COLORS.textSecondary}
            />

            <Text style={styles.formLabel}>Instructions:</Text>
            <TextInput
              style={styles.instructionsInput}
              value={newMemory.instructions}
              onChangeText={instructions =>
                setNewMemory({ ...newMemory, instructions })
              }
              placeholder="What should FREDO remember?"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  addButton: {
    margin: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  memoriesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  memoryCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memoryTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  memoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionButtonText: {
    fontSize: 18,
  },
  memoryInstructions: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  memoryDate: {
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
    width: 60,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSave: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right',
  },
  modalContent: {
    padding: 16,
  },
  formLabel: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  titleInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
  },
  instructionsInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    minHeight: 200,
  },
});
