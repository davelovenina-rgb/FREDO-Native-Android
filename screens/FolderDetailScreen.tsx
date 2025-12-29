import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Folder, ProjectFile } from '../types';
import { COLORS } from '../constants';

const STORAGE_KEY = '@fredo_folders';

interface FolderDetailScreenProps {
  navigation: any;
  route: {
    params: {
      folderId: string;
    };
  };
}

const FolderDetailScreen: React.FC<FolderDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { folderId } = route.params;
  const [folder, setFolder] = useState<Folder | null>(null);

  useEffect(() => {
    loadFolder();
  }, []);

  const loadFolder = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const folders: Folder[] = JSON.parse(stored);
        const found = folders.find((f) => f.id === folderId);
        if (found) {
          setFolder(found);
        } else {
          Alert.alert('Error', 'Folder not found');
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Failed to load folder:', error);
    }
  };

  const deleteFile = (fileId: string) => {
    Alert.alert('Delete File', 'Are you sure you want to delete this file?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
              const folders: Folder[] = JSON.parse(stored);
              const updatedFolders = folders.map((f) =>
                f.id === folderId
                  ? { ...f, files: f.files?.filter((file) => file.id !== fileId) }
                  : f
              );
              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedFolders)
              );
              loadFolder();
            }
          } catch (error) {
            console.error('Failed to delete file:', error);
            Alert.alert('Error', 'Failed to delete file');
          }
        },
      },
    ]);
  };

  const uploadFile = () => {
    Alert.alert(
      'Upload File',
      'File upload functionality will be added in the next update. This requires native file picker integration.'
    );
  };

  const changeFileAccess = (fileId: string) => {
    const file = folder?.files?.find((f) => f.id === fileId);
    if (!file) return;

    const currentAccess = file.threadAccess || 'inherit';
    const folderAccess = folder?.threadAccess || 'open';

    Alert.alert(
      'Thread Access',
      `Current: ${currentAccess.toUpperCase()}\nFolder Default: ${folderAccess.toUpperCase()}\n\nChoose access level:`,
      [
        {
          text: 'Inherit from Folder',
          onPress: () => updateFileAccess(fileId, 'inherit'),
        },
        {
          text: '📖 Open Access',
          onPress: () => updateFileAccess(fileId, 'open'),
        },
        {
          text: '🔒 Sealed',
          onPress: () => updateFileAccess(fileId, 'sealed'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateFileAccess = async (
    fileId: string,
    access: 'open' | 'sealed' | 'inherit'
  ) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const folders: Folder[] = JSON.parse(stored);
        const updatedFolders = folders.map((f) =>
          f.id === folderId
            ? {
                ...f,
                files: f.files?.map((file) =>
                  file.id === fileId ? { ...file, threadAccess: access } : file
                ),
              }
            : f
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFolders));
        loadFolder();
      }
    } catch (error) {
      console.error('Failed to update file access:', error);
      Alert.alert('Error', 'Failed to update file access');
    }
  };

  if (!folder) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>{folder.name}</Text>
          <Text style={styles.headerSubtitle}>
            {folder.files?.length || 0} FILE
            {(folder.files?.length || 0) !== 1 ? 'S' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={uploadFile}>
          <Text style={styles.uploadButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {(!folder.files || folder.files.length === 0) ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>No Files Yet</Text>
            <Text style={styles.emptyText}>
              Upload files to this folder to keep them organized
            </Text>
            <TouchableOpacity
              style={styles.uploadEmptyButton}
              onPress={uploadFile}
            >
              <Text style={styles.uploadEmptyButtonText}>UPLOAD FILE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.filesList}>
            {folder.files.map((file) => (
              <View key={file.id} style={styles.fileCard}>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileIcon}>
                    {getFileIcon(file.mimeType)}
                  </Text>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.fileMetadata}>
                      {new Date(file.timestamp).toLocaleDateString()} •{' '}
                      {file.mimeType || 'Unknown type'}
                    </Text>
                    <View style={styles.accessBadge}>
                      <Text style={styles.accessBadgeText}>
                        {getAccessDisplay(file.threadAccess, folder.threadAccess)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.fileActions}>
                  <TouchableOpacity
                    style={styles.fileActionButton}
                    onPress={() => changeFileAccess(file.id)}
                  >
                    <Text style={styles.fileActionIcon}>
                      {getAccessIcon(file.threadAccess, folder.threadAccess)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.fileActionButton}
                    onPress={() =>
                      Alert.alert('View File', 'File viewer coming soon')
                    }
                  >
                    <Text style={styles.fileActionIcon}>👁️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.fileActionButton}
                    onPress={() => deleteFile(file.id)}
                  >
                    <Text style={styles.fileActionIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const getFileIcon = (mimeType?: string): string => {
  if (!mimeType) return '📄';
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📕';
  if (mimeType.includes('text')) return '📝';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '📦';
  return '📄';
};

const getAccessIcon = (
  fileAccess?: 'open' | 'sealed' | 'inherit',
  folderAccess?: 'open' | 'sealed' | 'inherit'
): string => {
  const effectiveAccess = fileAccess === 'inherit' || !fileAccess ? folderAccess || 'open' : fileAccess;
  return effectiveAccess === 'sealed' ? '🔒' : '📖';
};

const getAccessDisplay = (
  fileAccess?: 'open' | 'sealed' | 'inherit',
  folderAccess?: 'open' | 'sealed' | 'inherit'
): string => {
  if (!fileAccess || fileAccess === 'inherit') {
    const effective = folderAccess || 'open';
    return `📎 Inherit (${effective === 'sealed' ? '🔒 Sealed' : '📖 Open'})`;
  }
  return fileAccess === 'sealed' ? '🔒 Sealed' : '📖 Open';
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
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
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
  uploadEmptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  uploadEmptyButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  filesList: {
    gap: 12,
  },
  fileCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  fileMetadata: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  accessBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  accessBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  fileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  fileActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileActionIcon: {
    fontSize: 18,
  },
});

export default FolderDetailScreen;
