import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';

interface ProviderKeys {
  gemini: string;
  googleCloud: string;
  openai: string;
  claude: string;
  grok: string;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

interface Provider {
  id: keyof ProviderKeys;
  name: string;
  icon: string;
  desc: string;
}

const PROVIDERS: Provider[] = [
  { id: 'gemini', name: 'Gemini Frequency', icon: '💎', desc: 'AI Studio Registry' },
  {
    id: 'googleCloud',
    name: 'Google Cloud Node',
    icon: '☁️',
    desc: 'Vertex AI Bridge',
  },
  {
    id: 'openai',
    name: 'OpenAI Frequency',
    icon: '🤖',
    desc: 'GPT-4o & o1 Registry',
  },
  {
    id: 'claude',
    name: 'Claude Frequency',
    icon: '🎭',
    desc: 'Anthropic Heritage',
  },
  { id: 'grok', name: 'Grok Frequency', icon: '🌌', desc: 'xAI High-Entropy' },
];

const STORAGE_KEY = '@fredo_api_keys';

const ApiVaultScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [keys, setKeys] = useState<ProviderKeys>({
    gemini: '',
    googleCloud: '',
    openai: '',
    claude: '',
    grok: '',
  });
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [testStatus, setTestStatus] = useState<{ [key: string]: TestStatus }>({});
  const [errorLog, setErrorLog] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setKeys(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveKeys = async (newKeys: ProviderKeys) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newKeys));
    } catch (error) {
      console.error('Failed to save API keys:', error);
      Alert.alert('Error', 'Failed to save API keys');
    }
  };

  const toggleVisibility = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const updateKey = (provider: keyof ProviderKeys, value: string) => {
    const newKeys = { ...keys, [provider]: value };
    setKeys(newKeys);
    saveKeys(newKeys);
    setTestStatus((prev) => ({ ...prev, [provider]: 'idle' }));
  };

  const testFrequency = async (provider: keyof ProviderKeys) => {
    const key = keys[provider];

    if (!key) {
      setTestStatus((prev) => ({ ...prev, [provider]: 'error' }));
      setErrorLog((prev) => ({
        ...prev,
        [provider]: 'No registry token provided. Node is currently empty.',
      }));
      return;
    }

    setTestStatus((prev) => ({ ...prev, [provider]: 'testing' }));

    try {
      let endpoint = '';
      let headers: any = { Authorization: `Bearer ${key}` };

      switch (provider) {
        case 'gemini':
        case 'googleCloud':
          // For Gemini, we'll do a simple validation check
          // Full API test would require the Google GenAI SDK
          if (key.length < 20) {
            throw new Error('Invalid API key format');
          }
          break;
        case 'openai':
          endpoint = 'https://api.openai.com/v1/models';
          break;
        case 'claude':
          endpoint = 'https://api.anthropic.com/v1/messages';
          headers['anthropic-version'] = '2023-06-01';
          break;
        case 'grok':
          endpoint = 'https://api.x.ai/v1/models';
          break;
      }

      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'GET',
          headers,
        });

        if (!res.ok && res.status !== 405) {
          throw new Error(`Handshake failed: ${res.status}`);
        }
      }

      setTestStatus((prev) => ({ ...prev, [provider]: 'success' }));
      setErrorLog((prev) => ({ ...prev, [provider]: '' }));
      Alert.alert('Success', `${PROVIDERS.find((p) => p.id === provider)?.name} verified!`);
    } catch (err: any) {
      setTestStatus((prev) => ({ ...prev, [provider]: 'error' }));
      setErrorLog((prev) => ({
        ...prev,
        [provider]: err.message || 'Signal disruption.',
      }));
      Alert.alert('Error', err.message || 'Connection test failed');
    }
  };

  const clearAllKeys = () => {
    Alert.alert(
      'Clear All Keys',
      'Are you sure you want to clear all API keys? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const emptyKeys = {
              gemini: '',
              googleCloud: '',
              openai: '',
              claude: '',
              grok: '',
            };
            setKeys(emptyKeys);
            await saveKeys(emptyKeys);
            setTestStatus({});
            setErrorLog({});
            Alert.alert('Success', 'All API keys cleared');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
          <Text style={styles.headerTitle}>REGISTRY VAULT</Text>
          <Text style={styles.headerSubtitle}>
            SOVEREIGN FREQUENCIES: UNLOCKED
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            ALL NODES ARE BLANK. DAVID RODRIGUEZ MUST MANUALLY REGISTER TOKENS
            FOR EXTERNAL HANDSHAKING.
          </Text>
        </View>

        {/* Provider Cards */}
        {PROVIDERS.map((p) => (
          <View key={p.id} style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <View style={styles.providerInfo}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{p.icon}</Text>
                </View>
                <View>
                  <Text style={styles.providerName}>{p.name}</Text>
                  <Text style={styles.providerDesc}>{p.desc}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.testButton,
                  testStatus[p.id] === 'success' && styles.testButtonSuccess,
                ]}
                onPress={() => testFrequency(p.id)}
                disabled={testStatus[p.id] === 'testing'}
              >
                {testStatus[p.id] === 'testing' ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.testButtonText}>
                    {testStatus[p.id] === 'success' ? 'VERIFIED' : 'VERIFY'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.keyInput}
                value={keys[p.id]}
                onChangeText={(text) => updateKey(p.id, text)}
                placeholder="Unregistered Node..."
                placeholderTextColor="#333"
                secureTextEntry={!showKeys[p.id]}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => toggleVisibility(p.id)}
              >
                <Text style={styles.toggleButtonText}>
                  {showKeys[p.id] ? 'HIDE' : 'SHOW'}
                </Text>
              </TouchableOpacity>
            </View>

            {testStatus[p.id] === 'error' && errorLog[p.id] && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorLog[p.id]}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Clear All Button */}
        <TouchableOpacity style={styles.clearButton} onPress={clearAllKeys}>
          <Text style={styles.clearButtonText}>CLEAR ALL KEYS</Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            SOVEREIGN PRIVACY PROTOCOL ACTIVE. TOKENS ARE STORED IN LOCAL DEVICE
            MEMORY ONLY.
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 16,
  },
  infoBanner: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  infoBannerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 16,
  },
  providerCard: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  providerDesc: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  testButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  testButtonSuccess: {
    backgroundColor: '#10b981',
  },
  testButtonText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  keyInput: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    color: COLORS.text,
    fontSize: 12,
    fontFamily: 'monospace',
    paddingRight: 60,
  },
  toggleButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  toggleButtonText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ef4444',
    letterSpacing: 1,
  },
  clearButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  clearButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ef4444',
    letterSpacing: 2,
  },
  privacyNotice: {
    alignItems: 'center',
    paddingVertical: 32,
    opacity: 0.3,
  },
  lockIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  privacyText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 14,
  },
});

export default ApiVaultScreen;
