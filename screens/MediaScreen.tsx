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
import { MediaEntry } from '../types';

export default function MediaScreen() {
  const [entries, setEntries] = useState<MediaEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'book' as 'book' | 'film' | 'music' | 'podcast',
    title: '',
    creator: '',
    rating: 5,
    reflection: '',
  });

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    saveEntries();
  }, [entries]);

  const loadEntries = async () => {
    try {
      const saved = await AsyncStorage.getItem('media_entries');
      if (saved) setEntries(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading media entries:', error);
    }
  };

  const saveEntries = async () => {
    try {
      await AsyncStorage.setItem('media_entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving media entries:', error);
    }
  };

  const addEntry = () => {
    if (!newEntry.title.trim() || !newEntry.creator.trim()) return;

    const entry: MediaEntry = {
      id: Date.now().toString(),
      type: newEntry.type,
      title: newEntry.title.trim(),
      creator: newEntry.creator.trim(),
      rating: newEntry.rating,
      reflection: newEntry.reflection.trim(),
      timestamp: Date.now(),
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      type: 'book',
      title: '',
      creator: '',
      rating: 5,
      reflection: '',
    });
    setShowAddEntry(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return '📚';
      case 'film':
        return '🎬';
      case 'music':
        return '🎵';
      case 'podcast':
        return '🎙️';
      default:
        return '📖';
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
          {showAddEntry ? '− Cancel' : '+ Add Media'}
        </Text>
      </TouchableOpacity>

      {/* Add Entry Form */}
      {showAddEntry && (
        <View style={styles.addForm}>
          <Text style={styles.formLabel}>Type:</Text>
          <View style={styles.typeButtons}>
            {['book', 'film', 'music', 'podcast'].map(type => (
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
                  {getTypeIcon(type)} {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>Title:</Text>
          <TextInput
            style={styles.input}
            value={newEntry.title}
            onChangeText={title => setNewEntry({ ...newEntry, title })}
            placeholder="Enter title..."
            placeholderTextColor={COLORS.textSecondary}
          />

          <Text style={styles.formLabel}>Creator/Artist:</Text>
          <TextInput
            style={styles.input}
            value={newEntry.creator}
            onChangeText={creator => setNewEntry({ ...newEntry, creator })}
            placeholder="Enter creator name..."
            placeholderTextColor={COLORS.textSecondary}
          />

          <Text style={styles.formLabel}>Rating: {newEntry.rating}/10</Text>
          <View style={styles.ratingButtons}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  newEntry.rating === rating && styles.ratingButtonActive,
                ]}
                onPress={() => setNewEntry({ ...newEntry, rating })}
              >
                <Text
                  style={[
                    styles.ratingButtonText,
                    newEntry.rating === rating && styles.ratingButtonTextActive,
                  ]}
                >
                  {rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>Reflection:</Text>
          <TextInput
            style={styles.textArea}
            value={newEntry.reflection}
            onChangeText={reflection => setNewEntry({ ...newEntry, reflection })}
            placeholder="What did you think?"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.submitButton} onPress={addEntry}>
            <Text style={styles.submitButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Entries List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registry</Text>
        {entries.length === 0 ? (
          <Text style={styles.emptyText}>
            No entries yet. Start tracking your media!
          </Text>
        ) : (
          entries.map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryIcon}>{getTypeIcon(entry.type)}</Text>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryCreator}>by {entry.creator}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingBadgeText}>{entry.rating}/10</Text>
                </View>
              </View>
              {entry.reflection && (
                <Text style={styles.entryReflection}>{entry.reflection}</Text>
              )}
              <Text style={styles.entryDate}>
                {new Date(entry.timestamp).toLocaleDateString()}
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
    flexWrap: 'wrap',
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
  ratingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ratingButtonText: {
    color: COLORS.text,
    fontSize: 14,
  },
  ratingButtonTextActive: {
    color: COLORS.background,
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
    minHeight: 100,
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
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  entryCreator: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  ratingBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingBadgeText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  entryReflection: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
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
