import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS } from '../constants';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

const ActionMenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const actions: ActionItem[] = [
    {
      id: 'new-chat',
      title: 'New Conversation',
      description: 'Start a fresh chat with FREDO',
      icon: '💬',
      color: '#3b82f6',
      action: () => navigation.navigate('Home'),
    },
    {
      id: 'log-health',
      title: 'Log Health Data',
      description: 'Record glucose, weight, or medication',
      icon: '❤️',
      color: '#ef4444',
      action: () => navigation.navigate('Health'),
    },
    {
      id: 'spiritual',
      title: 'Spiritual Reflection',
      description: 'Add prayer, gratitude, or reflection',
      icon: '🙏',
      color: '#8b5cf6',
      action: () => navigation.navigate('Spiritual'),
    },
    {
      id: 'add-media',
      title: 'Add Media Entry',
      description: 'Log book, film, music, or podcast',
      icon: '📚',
      color: '#10b981',
      action: () => navigation.navigate('Media'),
    },
    {
      id: 'create-task',
      title: 'Create Task',
      description: 'Add a new task to your list',
      icon: '✓',
      color: '#f59e0b',
      action: () => navigation.navigate('Tasks'),
    },
    {
      id: 'write-note',
      title: 'Write Note',
      description: 'Quick note or memo',
      icon: '📝',
      color: '#ec4899',
      action: () => navigation.navigate('Notes'),
    },
    {
      id: 'neural-memory',
      title: 'Neural Memory',
      description: 'Create persistent memory for FREDO',
      icon: '🧠',
      color: '#06b6d4',
      action: () => navigation.navigate('Memories'),
    },
    {
      id: 'drive-mode',
      title: 'Drive Mode',
      description: 'Hands-free voice assistant',
      icon: '🚗',
      color: '#6366f1',
      action: () => navigation.navigate('Drive'),
    },
    {
      id: 'agent-settings',
      title: 'Agent Settings',
      description: 'Configure AI personality',
      icon: '🤖',
      color: '#d97706',
      action: () => {
        // TODO: Pass actual agent data
        Alert.alert('Coming Soon', 'Agent settings will be available soon');
      },
    },
    {
      id: 'api-vault',
      title: 'API Vault',
      description: 'Manage API keys',
      icon: '🔑',
      color: '#84cc16',
      action: () => navigation.navigate('ApiVault'),
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View your activity overview',
      icon: '📊',
      color: '#14b8a6',
      action: () => navigation.navigate('Dashboard'),
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'App preferences and configuration',
      icon: '⚙️',
      color: '#64748b',
      action: () => navigation.navigate('Settings'),
    },
  ];

  const categories = [
    {
      title: 'COMMUNICATION',
      items: actions.filter((a) =>
        ['new-chat', 'drive-mode'].includes(a.id)
      ),
    },
    {
      title: 'TRACKING',
      items: actions.filter((a) =>
        ['log-health', 'spiritual', 'add-media'].includes(a.id)
      ),
    },
    {
      title: 'PRODUCTIVITY',
      items: actions.filter((a) =>
        ['create-task', 'write-note', 'neural-memory'].includes(a.id)
      ),
    },
    {
      title: 'SYSTEM',
      items: actions.filter((a) =>
        ['agent-settings', 'api-vault', 'dashboard', 'settings'].includes(a.id)
      ),
    },
  ];

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
          <Text style={styles.headerTitle}>ACTION MENU</Text>
          <Text style={styles.headerSubtitle}>QUICK ACCESS CONTROL</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {categories.map((category) => (
          <View key={category.title} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.actionCard, { borderLeftColor: item.color }]}
                onPress={item.action}
              >
                <View style={styles.actionIconContainer}>
                  <Text style={styles.actionIcon}>{item.icon}</Text>
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{item.title}</Text>
                  <Text style={styles.actionDescription}>
                    {item.description}
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tap any action to navigate quickly
          </Text>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  category: {
    padding: 20,
    paddingBottom: 0,
  },
  categoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionArrow: {
    fontSize: 20,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  footer: {
    padding: 40,
    alignItems: 'center',
    opacity: 0.3,
  },
  footerText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ActionMenuScreen;
