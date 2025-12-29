import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { SpiritualEntry } from '../types';

export default function SpiritualScreen() {
  const [entries, setEntries] = useState<SpiritualEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'reflection' as 'reflection' | 'prayer' | 'gratitude',
    content: '',
    scriptureReference: '',
  });

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    saveEntries();
  }, [entries]);

  const loadEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem('spiritual_entries');
      if (saved) setEntries(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading spiritual entries:', error);
    }
  };

  const saveEntries = async () => {
    try {
      await AsyncStorage.setItem('spiritual_entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving spiritual entries:', error);
    }
  };

  const addEntry = () => {
    if (!newEntry.content.trim()) return;

    const entry: SpiritualEntry = {
      id: Date.now().toString(),
      type: newEntry.type,
      content: newEntry.content.trim(),
      timestamp: Date.now(),
      scriptureReference: newEntry.scriptureReference.trim() || undefined,
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ type: 'reflection', content: '', scriptureReference: '' });
    setShowAddEntry(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prayer':
        return '#10B981';
      case 'gratitude':
        return '#F59E0B';
      default:
        return COLORS.primary;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Add Entry Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddEntry(!showAddEntry)}
      >
        <Text style={styles.addButtonText}>
          {showAddEntry ? '− Cancel' : '+ New Entry'}
        </Text>
      </TouchableOpacity>

      {/* Add Entry Form */}
      {showAddEntry && (
        <View style={styles.addForm}>
          <Text style={styles.formLabel}>Type:</Text>
          <View style={styles.typeButtons}>
            {['reflection', 'prayer', 'gratitude'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  newEntry.type === type && styles.typeButtonActive,
                ]}
                onPress={() => setNewEntry({ ...newEntry, type: type as any })}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    newEntry.type === type && styles.typeButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>Content:</Text>
          <TextInput
            style={styles.textArea}
            value={newEntry.content}
            onChangeText={content => setNewEntry({ ...newEntry, content })}
            placeholder="Write your entry..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={6}
          />

          <Text style={styles.formLabel}>Scripture Reference (Optional):</Text>
          <TextInput
            style={styles.input}
            value={newEntry.scriptureReference}
            onChangeText={scriptureReference =>
              setNewEntry({ ...newEntry, scriptureReference })
            }
            placeholder="e.g., Psalm 23:1"
            placeholderTextColor={COLORS.textSecondary}
          />

          <TouchableOpacity style={styles.submitButton} onPress={addEntry}>
            <Text style={styles.submitButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Entries List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Archive</Text>
        {entries.length === 0 ? (
          <Text style={styles.emptyText}>
            No entries yet. Start your spiritual journey!
          </Text>
        ) : (
          entries.map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <View
                style={[
                  styles.entryType,
                  { backgroundColor: getTypeColor(entry.type) },
                ]}
              >
                <Text style={styles.entryTypeText}>
                  {entry.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.entryContent}>{entry.content}</Text>
              {entry.scriptureReference && (
                <Text style={styles.entryScripture}>
                  📖 {entry.scriptureReference}
                </Text>
              )}
              <Text style={styles.entryDate}>
                {new Date(entry.timestamp).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  addForm: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  formLabel: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    color: COLORS.text,
    fontSize: 12,
  },
  typeButtonTextActive: {
    color: COLORS.background,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  entryCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  entryTypeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  entryContent: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  entryScripture: {
    color: COLORS.primary,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  entryDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});
