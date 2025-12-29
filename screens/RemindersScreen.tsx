import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '../types';
import { COLORS } from '../constants';

const STORAGE_KEY = '@fredo_reminders';

const RemindersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [title, setTitle] = useState('');
  const [selectedRepeat, setSelectedRepeat] = useState<'once' | 'daily' | 'weekly'>('once');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  };

  const saveReminders = async (newReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (error) {
      console.error('Failed to save reminders:', error);
      Alert.alert('Error', 'Failed to save reminders');
    }
  };

  const openModal = (reminder?: Reminder) => {
    if (reminder) {
      setEditingReminder(reminder);
      setTitle(reminder.title);
      setSelectedRepeat(reminder.repeat);
      setSelectedDate(new Date(reminder.timestamp));
    } else {
      setEditingReminder(null);
      setTitle('');
      setSelectedRepeat('once');
      setSelectedDate(new Date());
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingReminder(null);
    setTitle('');
    setSelectedRepeat('once');
    setSelectedDate(new Date());
  };

  const saveReminder = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a reminder title');
      return;
    }

    const newReminder: Reminder = {
      id: editingReminder?.id || Date.now().toString(),
      title: title.trim(),
      timestamp: selectedDate.getTime(),
      repeat: selectedRepeat,
    };

    let updatedReminders: Reminder[];
    if (editingReminder) {
      updatedReminders = reminders.map((r) =>
        r.id === editingReminder.id ? newReminder : r
      );
    } else {
      updatedReminders = [...reminders, newReminder];
    }

    saveReminders(updatedReminders);
    closeModal();
  };

  const deleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedReminders = reminders.filter((r) => r.id !== id);
            saveReminders(updatedReminders);
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days < 7) {
      return `${date.toLocaleDateString([], { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const sortedReminders = [...reminders].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>REMINDERS</Text>
          <Text style={styles.headerSubtitle}>
            {reminders.length} ACTIVE REMINDER{reminders.length !== 1 ? 'S' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {sortedReminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No Reminders Yet</Text>
            <Text style={styles.emptyText}>
              Tap the + button to create your first reminder
            </Text>
          </View>
        ) : (
          sortedReminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderTime}>
                  {formatDate(reminder.timestamp)}
                </Text>
                <View style={styles.reminderBadge}>
                  <Text style={styles.reminderBadgeText}>
                    {reminder.repeat.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.reminderActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openModal(reminder)}
                >
                  <Text style={styles.actionButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deleteReminder(reminder.id)}
                >
                  <Text style={styles.actionButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingReminder ? 'EDIT REMINDER' : 'NEW REMINDER'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.label}>REMINDER TITLE</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter reminder title..."
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.label}>REPEAT</Text>
              <View style={styles.repeatButtons}>
                {(['once', 'daily', 'weekly'] as const).map((repeat) => (
                  <TouchableOpacity
                    key={repeat}
                    style={[
                      styles.repeatButton,
                      selectedRepeat === repeat && styles.repeatButtonActive,
                    ]}
                    onPress={() => setSelectedRepeat(repeat)}
                  >
                    <Text
                      style={[
                        styles.repeatButtonText,
                        selectedRepeat === repeat && styles.repeatButtonTextActive,
                      ]}
                    >
                      {repeat.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>DATE & TIME</Text>
              <Text style={styles.datePreview}>
                {selectedDate.toLocaleString()}
              </Text>
              <Text style={styles.dateNote}>
                Note: Full date/time picker will be added in next update
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveReminder}
              >
                <Text style={styles.saveButtonText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 32,
    color: COLORS.text,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  reminderTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  reminderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reminderBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1,
  },
  modalClose: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  repeatButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  repeatButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  repeatButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  repeatButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  repeatButtonTextActive: {
    color: '#000',
  },
  datePreview: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  dateNote: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
});

export default RemindersScreen;
