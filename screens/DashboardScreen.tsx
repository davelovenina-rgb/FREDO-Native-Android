import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants';

interface DashboardStats {
  totalConversations: number;
  totalMessages: number;
  healthReadings: number;
  spiritualEntries: number;
  mediaItems: number;
  tasks: number;
  notes: number;
}

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    totalMessages: 0,
    healthReadings: 0,
    spiritualEntries: 0,
    mediaItems: 0,
    tasks: 0,
    notes: 0,
  });

  useEffect(() => {
    // TODO: Load actual stats from AsyncStorage
    // This is placeholder data
    setStats({
      totalConversations: 12,
      totalMessages: 247,
      healthReadings: 89,
      spiritualEntries: 34,
      mediaItems: 18,
      tasks: 7,
      notes: 15,
    });
  }, []);

  const quickActions = [
    {
      id: 'chat',
      title: 'New Chat',
      icon: '💬',
      color: '#3b82f6',
      screen: 'Home',
    },
    {
      id: 'health',
      title: 'Log Health',
      icon: '❤️',
      color: '#ef4444',
      screen: 'Health',
    },
    {
      id: 'spiritual',
      title: 'Reflect',
      icon: '🙏',
      color: '#8b5cf6',
      screen: 'Spiritual',
    },
    {
      id: 'media',
      title: 'Add Media',
      icon: '📚',
      color: '#10b981',
      screen: 'Media',
    },
  ];

  const statCards = [
    {
      title: 'Conversations',
      value: stats.totalConversations,
      icon: '💬',
      color: '#3b82f6',
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: '✉️',
      color: '#06b6d4',
    },
    {
      title: 'Health Logs',
      value: stats.healthReadings,
      icon: '❤️',
      color: '#ef4444',
    },
    {
      title: 'Spiritual',
      value: stats.spiritualEntries,
      icon: '🙏',
      color: '#8b5cf6',
    },
    {
      title: 'Media',
      value: stats.mediaItems,
      icon: '📚',
      color: '#10b981',
    },
    {
      title: 'Tasks',
      value: stats.tasks,
      icon: '✓',
      color: '#f59e0b',
    },
    {
      title: 'Notes',
      value: stats.notes,
      icon: '📝',
      color: '#ec4899',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'chat',
      title: 'Conversation with FREDO',
      time: '2 hours ago',
      icon: '💬',
    },
    {
      id: '2',
      type: 'health',
      title: 'Blood glucose logged',
      time: '4 hours ago',
      icon: '❤️',
    },
    {
      id: '3',
      type: 'spiritual',
      title: 'Morning reflection',
      time: '1 day ago',
      icon: '🙏',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back</Text>
          <Text style={styles.title}>FREDO Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickActionCard, { borderLeftColor: action.color }]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR ACTIVITY</Text>
        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { borderTopColor: stat.color }]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        {recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Text style={styles.activityIcon}>{activity.icon}</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* System Info */}
      <View style={styles.systemInfo}>
        <Text style={styles.systemInfoText}>
          FREDO - The Interpreter of Light
        </Text>
        <Text style={styles.systemInfoSubtext}>
          Mobile Edition • Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    fontSize: 32,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 3,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statTitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  systemInfo: {
    padding: 40,
    alignItems: 'center',
    opacity: 0.3,
  },
  systemInfoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  systemInfoSubtext: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default DashboardScreen;
