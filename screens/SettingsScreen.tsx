import React, { useState, useEffect } from 'react';
import { Share, Alert } from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { AppSettings } from '../types';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 1.0,
    voiceReplies: true,
    autoPlayAudio: true,
    nickname: 'David',
    occupation: 'Prism Core',
    toneStyle: 'default',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [settings]);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('app_settings');
      if (saved) setSettings(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportData = async () => {
    try {
      // Gather all data
      const allData: any = {};
      
      const keys = [
        'fredo_conversations',
        'health_readings',
        'medications',
        'spiritual_entries',
        'media_entries',
        'trips',
        'tasks',
        'notes',
        'neural_memories',
        'app_settings',
      ];

      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          allData[key] = JSON.parse(data);
        }
      }

      const exportString = JSON.stringify(allData, null, 2);
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Share the data
      await Share.share({
        message: exportString,
        title: `FREDO Backup ${timestamp}`,
      });
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export data');
      console.error('Export error:', error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete ALL your data. This cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Nickname</Text>
          <TextInput
            style={styles.input}
            value={settings.nickname}
            onChangeText={value => updateSetting('nickname', value)}
            placeholder="Your name..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Occupation</Text>
          <TextInput
            style={styles.input}
            value={settings.occupation}
            onChangeText={value => updateSetting('occupation', value)}
            placeholder="Your role..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      {/* Voice & Audio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice & Audio</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Voice Replies</Text>
            <Text style={styles.settingDescription}>
              Enable voice responses from FREDO
            </Text>
          </View>
          <Switch
            value={settings.voiceReplies}
            onValueChange={value => updateSetting('voiceReplies', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.text}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto-play Audio</Text>
            <Text style={styles.settingDescription}>
              Automatically play voice responses
            </Text>
          </View>
          <Switch
            value={settings.autoPlayAudio}
            onValueChange={value => updateSetting('autoPlayAudio', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.text}
          />
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Font Size</Text>
          <View style={styles.fontSizeButtons}>
            {[0.8, 1.0, 1.2, 1.4].map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  settings.fontSize === size && styles.fontSizeButtonActive,
                ]}
                onPress={() => updateSetting('fontSize', size)}
              >
                <Text
                  style={[
                    styles.fontSizeButtonText,
                    settings.fontSize === size && styles.fontSizeButtonTextActive,
                  ]}
                >
                  {size === 0.8 ? 'S' : size === 1.0 ? 'M' : size === 1.2 ? 'L' : 'XL'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Tone Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conversation Style</Text>

        <View style={styles.toneButtons}>
          {[
            'default',
            'professional',
            'friendly',
            'candid',
            'quirky',
            'efficient',
          ].map(tone => (
            <TouchableOpacity
              key={tone}
              style={[
                styles.toneButton,
                settings.toneStyle === tone && styles.toneButtonActive,
              ]}
              onPress={() => updateSetting('toneStyle', tone)}
            >
              <Text
                style={[
                  styles.toneButtonText,
                  settings.toneStyle === tone && styles.toneButtonTextActive,
                ]}
              >
                {tone}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.dataButton} onPress={exportData}>
          <Text style={styles.dataButtonText}>📤 Export All Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.dataButton, styles.dangerButton]}
          onPress={clearAllData}
        >
          <Text style={[styles.dataButtonText, styles.dangerButtonText]}>
            🗑️ Clear All Data
          </Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>FREDO</Text>
          <Text style={styles.aboutSubtitle}>The Interpreter of Light</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutFooter}>LA FAMILIA RODRIGUEZ — FOREVER 🇵🇷❤️🔥</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    marginTop: 8,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  fontSizeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  fontSizeButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  fontSizeButtonTextActive: {
    color: COLORS.background,
  },
  toneButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toneButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toneButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toneButtonText: {
    color: COLORS.text,
    fontSize: 14,
  },
  toneButtonTextActive: {
    color: COLORS.background,
  },
  aboutCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  aboutTitle: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  aboutSubtitle: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 16,
  },
  aboutVersion: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 16,
  },
  aboutFooter: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  dataButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  dataButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerButton: {
    borderColor: '#EF4444',
  },
  dangerButtonText: {
    color: '#EF4444',
  },
});
