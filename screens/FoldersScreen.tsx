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
import { Folder } from '../types';
import { COLORS } from '../constants';

const STORAGE_KEY = '@fredo_folders';

const FoldersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState('');
  const [threadAccess, setThreadAccess] = useState<'open' | 'sealed'>('open');
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFolders(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const saveFolders = async (newFolders: Folder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFolders));
      setFolders(newFolders);
    } catch (error) {
      console.error('Failed to save folders:', error);
      Alert.alert('Error', 'Failed to save folders');
    }
  };

  const openModal = (folder?: Folder) => {
    if (folder) {
      setEditingFolder(folder);
      setFolderName(folder.name);
      setThreadAccess(folder.threadAccess || 'open');
    } else {
      setEditingFolder(null);
      setFolderName('');
      setThreadAccess('open');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingFolder(null);
    setFolderName('');
    setThreadAccess('open');
  };

  const saveFolder = () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    if (editingFolder) {
      // Update existing folder
      const updatedFolders = folders.map((f) =>
        f.id === editingFolder.id ? { ...f, name: folderName.trim(), threadAccess } : f
      );
      saveFolders(updatedFolders);
    } else {
      // Create new folder
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: folderName.trim(),
        conversationIds: [],
        files: [],
        threadAccess,
      };
      saveFolders([...folders, newFolder]);
    }

    closeModal();
  };

  const deleteFolder = (id: string) => {
    Alert.alert(
      'Delete Folder',
      'Are you sure you want to delete this folder? Conversations will not be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedFolders = folders.filter((f) => f.id !== id);
            saveFolders(updatedFolders);
          },
        },
      ]
    );
  };

  const toggleFolder = (id: string) => {
    setExpandedFolderId(expandedFolderId === id ? null : id);
  };

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
          <Text style={styles.headerTitle}>FOLDERS</Text>
          <Text style={styles.headerSubtitle}>
            {folders.length} FOLDER{folders.length !== 1 ? 'S' : ''}
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
        {folders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyTitle}>No Folders Yet</Text>
            <Text style={styles.emptyText}>
              Organize your conversations and files into folders
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => openModal()}
            >
              <Text style={styles.createButtonText}>CREATE FIRST FOLDER</Text>
            </TouchableOpacity>
          </View>
        ) : (
          folders.map((folder) => (
            <View key={folder.id} style={styles.folderCard}>
              <TouchableOpacity
                style={styles.folderHeader}
                onPress={() => toggleFolder(folder.id)}
              >
                <View style={styles.folderInfo}>
                  <Text style={styles.folderIcon}>
                    {expandedFolderId === folder.id ? '📂' : '📁'}
                  </Text>
                  <View style={styles.folderDetails}>
                    <View style={styles.folderNameRow}>
                      <Text style={styles.folderName}>{folder.name}</Text>
                      <View style={styles.folderAccessBadge}>
                        <Text style={styles.folderAccessText}>
                          {folder.threadAccess === 'sealed' ? '🔒' : '📖'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.folderStats}>
                      {folder.conversationIds.length} conversation
                      {folder.conversationIds.length !== 1 ? 's' : ''} •{' '}
                      {folder.files?.length || 0} file
                      {(folder.files?.length || 0) !== 1 ? 's' : ''} •{' '}
                      {folder.threadAccess === 'sealed' ? 'Sealed' : 'Open'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.expandIcon}>
                  {expandedFolderId === folder.id ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>

              {expandedFolderId === folder.id && (
                <View style={styles.folderContent}>
                  <View style={styles.folderActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openModal(folder)}
                    >
                      <Text style={styles.actionButtonIcon}>✏️</Text>
                      <Text style={styles.actionButtonText}>Rename</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() =>
                        navigation.navigate('FolderDetail', { folderId: folder.id })
                      }
                    >
                      <Text style={styles.actionButtonIcon}>📄</Text>
                      <Text style={styles.actionButtonText}>View Files</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteAction]}
                      onPress={() => deleteFolder(folder.id)}
                    >
                      <Text style={styles.actionButtonIcon}>🗑️</Text>
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                  {folder.conversationIds.length > 0 && (
                    <View style={styles.conversationsList}>
                      <Text style={styles.sectionLabel}>CONVERSATIONS</Text>
                      {folder.conversationIds.map((convId) => (
                        <View key={convId} style={styles.conversationItem}>
                          <Text style={styles.conversationIcon}>💬</Text>
                          <Text style={styles.conversationText}>
                            Conversation {convId.slice(0, 8)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {(folder.files?.length || 0) > 0 && (
                    <View style={styles.filesList}>
                      <Text style={styles.sectionLabel}>FILES</Text>
                      {folder.files?.map((file) => (
                        <View key={file.id} style={styles.fileItem}>
                          <Text style={styles.fileIcon}>📎</Text>
                          <Text style={styles.fileText}>{file.name}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
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
                {editingFolder ? 'RENAME FOLDER' : 'NEW FOLDER'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.label}>FOLDER NAME</Text>
              <TextInput
                style={styles.input}
                value={folderName}
                onChangeText={setFolderName}
                placeholder="Enter folder name..."
                placeholderTextColor={COLORS.textSecondary}
                autoFocus
              />

              <Text style={[styles.label, { marginTop: 20 }]}>THREAD ACCESS</Text>
              <Text style={styles.helpText}>
                Control whether files in this folder can access external conversations
              </Text>
              <View style={styles.threadAccessContainer}>
                <TouchableOpacity
                  style={[
                    styles.accessOption,
                    threadAccess === 'open' && styles.accessOptionActive,
                  ]}
                  onPress={() => setThreadAccess('open')}
                >
                  <Text style={styles.accessIcon}>📖</Text>
                  <View style={styles.accessInfo}>
                    <Text
                      style={[
                        styles.accessTitle,
                        threadAccess === 'open' && styles.accessTitleActive,
                      ]}
                    >
                      OPEN ACCESS
                    </Text>
                    <Text style={styles.accessDescription}>
                      Files can reference external threads
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.accessOption,
                    threadAccess === 'sealed' && styles.accessOptionActive,
                  ]}
                  onPress={() => setThreadAccess('sealed')}
                >
                  <Text style={styles.accessIcon}>🔒</Text>
                  <View style={styles.accessInfo}>
                    <Text
                      style={[
                        styles.accessTitle,
                        threadAccess === 'sealed' && styles.accessTitleActive,
                      ]}
                    >
                      SEALED
                    </Text>
                    <Text style={styles.accessDescription}>
                      Isolated, no external thread access
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
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
                onPress={saveFolder}
              >
                <Text style={styles.saveButtonText}>
                  {editingFolder ? 'UPDATE' : 'CREATE'}
                </Text>
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
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  createButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  folderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  folderIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  folderDetails: {
    flex: 1,
  },
  folderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  folderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  folderAccessBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderAccessText: {
    fontSize: 12,
  },
  folderStats: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  expandIcon: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  folderContent: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 16,
    gap: 16,
  },
  folderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  deleteAction: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionButtonIcon: {
    fontSize: 16,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  conversationsList: {
    gap: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  conversationIcon: {
    fontSize: 16,
  },
  conversationText: {
    fontSize: 12,
    color: COLORS.text,
  },
  filesList: {
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  fileIcon: {
    fontSize: 16,
  },
  fileText: {
    fontSize: 12,
    color: COLORS.text,
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
  helpText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  threadAccessContainer: {
    gap: 10,
  },
  accessOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  accessOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
  },
  accessIcon: {
    fontSize: 28,
  },
  accessInfo: {
    flex: 1,
  },
  accessTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1,
    marginBottom: 2,
  },
  accessTitleActive: {
    color: COLORS.primary,
  },
  accessDescription: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 14,
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

export default FoldersScreen;
