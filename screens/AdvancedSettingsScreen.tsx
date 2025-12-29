import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';

interface AdvancedSettings {
  // AI Settings
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  
  // Voice Settings
  voiceEnabled: boolean;
  voiceSpeed: number;
  voicePitch: number;
  autoPlayResponses: boolean;
  
  // Privacy Settings
  saveConversations: boolean;
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;
  
  // Experimental Features
  experimentalMode: boolean;
  betaFeatures: boolean;
  debugMode: boolean;
}

const DEFAULT_SETTINGS: AdvancedSettings = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
  voiceEnabled: true,
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  autoPlayResponses: false,
  saveConversations: true,
  analyticsEnabled: false,
  crashReportsEnabled: true,
  experimentalMode: false,
  betaFeatures: false,
  debugMode: false,
};

const STORAGE_KEY = '@fredo_advanced_settings';

const AdvancedSettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [settings, setSettings] = useState<AdvancedSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load advanced settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setHasChanges(false);
      Alert.alert('Success', 'Advanced settings saved');
    } catch (error) {
      console.error('Failed to save advanced settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const updateSetting = <K extends keyof AdvancedSettings>(
    key: K,
    value: AdvancedSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all advanced settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings(DEFAULT_SETTINGS);
            setHasChanges(true);
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>ADVANCED SETTINGS</Text>
          <Text style={styles.headerSubtitle}>SYSTEM CONFIGURATION</Text>
        </View>
        {hasChanges && (
          <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* AI Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI MODEL PARAMETERS</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Temperature</Text>
              <Text style={styles.settingValue}>{settings.temperature.toFixed(2)}</Text>
            </View>
            <Text style={styles.settingDescription}>
              Controls randomness (0.0 = focused, 1.0 = creative)
            </Text>
            <TextInput
              style={styles.input}
              value={settings.temperature.toString()}
              onChangeText={(text) => {
                const val = parseFloat(text);
                if (!isNaN(val) && val >= 0 && val <= 1) {
                  updateSetting('temperature', val);
                }
              }}
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Max Tokens</Text>
              <Text style={styles.settingValue}>{settings.maxTokens}</Text>
            </View>
            <Text style={styles.settingDescription}>
              Maximum response length (256-8192)
            </Text>
            <TextInput
              style={styles.input}
              value={settings.maxTokens.toString()}
              onChangeText={(text) => {
                const val = parseInt(text);
                if (!isNaN(val) && val >= 256 && val <= 8192) {
                  updateSetting('maxTokens', val);
                }
              }}
              keyboardType="number-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Top P</Text>
              <Text style={styles.settingValue}>{settings.topP.toFixed(2)}</Text>
            </View>
            <Text style={styles.settingDescription}>
              Nucleus sampling threshold (0.0-1.0)
            </Text>
            <TextInput
              style={styles.input}
              value={settings.topP.toString()}
              onChangeText={(text) => {
                const val = parseFloat(text);
                if (!isNaN(val) && val >= 0 && val <= 1) {
                  updateSetting('topP', val);
                }
              }}
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Frequency Penalty</Text>
              <Text style={styles.settingValue}>{settings.frequencyPenalty.toFixed(2)}</Text>
            </View>
            <Text style={styles.settingDescription}>
              Reduce repetition (-2.0 to 2.0)
            </Text>
            <TextInput
              style={styles.input}
              value={settings.frequencyPenalty.toString()}
              onChangeText={(text) => {
                const val = parseFloat(text);
                if (!isNaN(val) && val >= -2 && val <= 2) {
                  updateSetting('frequencyPenalty', val);
                }
              }}
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Presence Penalty</Text>
              <Text style={styles.settingValue}>{settings.presencePenalty.toFixed(2)}</Text>
            </View>
            <Text style={styles.settingDescription}>
              Encourage new topics (-2.0 to 2.0)
            </Text>
            <TextInput
              style={styles.input}
              value={settings.presencePenalty.toString()}
              onChangeText={(text) => {
                const val = parseFloat(text);
                if (!isNaN(val) && val >= -2 && val <= 2) {
                  updateSetting('presencePenalty', val);
                }
              }}
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        {/* Voice Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VOICE CONFIGURATION</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Voice Enabled</Text>
                <Text style={styles.settingDescription}>
                  Enable text-to-speech responses
                </Text>
              </View>
              <Switch
                value={settings.voiceEnabled}
                onValueChange={(val) => updateSetting('voiceEnabled', val)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto-Play Responses</Text>
                <Text style={styles.settingDescription}>
                  Automatically play voice responses
                </Text>
              </View>
              <Switch
                value={settings.autoPlayResponses}
                onValueChange={(val) => updateSetting('autoPlayResponses', val)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACY & DATA</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Save Conversations</Text>
                <Text style={styles.settingDescription}>
                  Store chat history locally
                </Text>
              </View>
              <Switch
                value={settings.saveConversations}
                onValueChange={(val) => updateSetting('saveConversations', val)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Analytics</Text>
                <Text style={styles.settingDescription}>
                  Help improve FREDO with usage data
                </Text>
              </View>
              <Switch
                value={settings.analyticsEnabled}
                onValueChange={(val) => updateSetting('analyticsEnabled', val)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Crash Reports</Text>
                <Text style={styles.settingDescription}>
                  Send error reports to developers
                </Text>
              </View>
              <Switch
                value={settings.crashReportsEnabled}
                onValueChange={(val) => updateSetting('crashReportsEnabled', val)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Experimental Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPERIMENTAL FEATURES</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Experimental Mode</Text>
                <Text style={styles.settingDescription}>
                  Enable cutting-edge features
                </Text>
              </View>
              <Switch
                value={settings.experimentalMode}
                onValueChange={(val) => updateSetting('experimentalMode', val)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Beta Features</Text>
                <Text style={styles.settingDescription}>
                  Access unreleased features
                </Text>
              </View>
              <Switch
                value={settings.betaFeatures}
                onValueChange={(val) => updateSetting('betaFeatures', val)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Debug Mode</Text>
                <Text style={styles.settingDescription}>
                  Show detailed logs and diagnostics
                </Text>
              </View>
              <Switch
                value={settings.debugMode}
                onValueChange={(val) => updateSetting('debugMode', val)}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
          <Text style={styles.resetButtonText}>RESET TO DEFAULTS</Text>
        </TouchableOpacity>

        {/* Warning */}
        <View style={styles.warning}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Modifying these settings may affect FREDO's performance and behavior.
            Only change values if you understand their impact.
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
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  settingDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  resetButton: {
    margin: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ef4444',
    letterSpacing: 2,
  },
  warning: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.primary,
    lineHeight: 18,
  },
});

export default AdvancedSettingsScreen;
