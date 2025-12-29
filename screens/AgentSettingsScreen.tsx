import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Agent, Conversation } from '../types';
import { COLORS } from '../constants';

interface AgentSettingsScreenProps {
  route: {
    params: {
      agent: Agent;
      conversations: Conversation[];
      onUpdateAgent: (agent: Agent) => void;
    };
  };
  navigation: any;
}

type TabType = 'core' | 'knowledge' | 'history';

const AgentSettingsScreen: React.FC<AgentSettingsScreenProps> = ({
  route,
  navigation,
}) => {
  const { agent: initialAgent, conversations, onUpdateAgent } = route.params;
  const [agent, setAgent] = useState<Agent>(initialAgent);
  const [activeTab, setActiveTab] = useState<TabType>('core');
  const [urlInput, setUrlInput] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const updateField = (key: keyof Agent, val: any) => {
    const updatedAgent = { ...agent, [key]: val };
    setAgent(updatedAgent);
    onUpdateAgent(updatedAgent);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const filteredHistory = useMemo(() => {
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(historySearch.toLowerCase()) ||
        c.messages.some((m) =>
          m.content.toLowerCase().includes(historySearch.toLowerCase())
        )
    );
  }, [conversations, historySearch]);

  const addKnowledgeUrl = () => {
    if (!urlInput.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }
    // Note: Knowledge sources feature requires additional type definition
    // This is a placeholder for future implementation
    Alert.alert('Coming Soon', 'Knowledge sources will be added in next update');
    setUrlInput('');
  };

  const voicePresets = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

  const renderCore = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.label}>CORE PERSONA INSTRUCTIONS</Text>
        <TextInput
          style={styles.textArea}
          value={agent.instructions}
          onChangeText={(text) => updateField('instructions', text)}
          placeholder="Describe behavioral logic and knowledge focus..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={10}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>VOCAL CALIBRATION</Text>
        <View style={styles.voiceContainer}>
          <View style={styles.voiceGrid}>
            {voicePresets.map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.voiceButton,
                  agent.voicePreset === v && styles.voiceButtonActive,
                ]}
                onPress={() => updateField('voicePreset', v)}
              >
                <Text
                  style={[
                    styles.voiceButtonText,
                    agent.voicePreset === v && styles.voiceButtonTextActive,
                  ]}
                >
                  {v.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>FREQUENCY SPEED</Text>
              <Text style={styles.sliderValue}>{agent.voiceSpeed.toFixed(1)}x</Text>
            </View>
            <TextInput
              style={styles.sliderInput}
              value={agent.voiceSpeed.toString()}
              onChangeText={(text) => {
                const val = parseFloat(text);
                if (!isNaN(val) && val >= 0.5 && val <= 2.0) {
                  updateField('voiceSpeed', val);
                }
              }}
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderLabel}>TONAL PITCH</Text>
              <Text style={styles.sliderValue}>{agent.pitch.toFixed(1)}x</Text>
            </View>
            <TextInput
              style={styles.sliderInput}
              value={agent.pitch.toString()}
              onChangeText={(text) => {
                const val = parseFloat(text);
                if (!isNaN(val) && val >= 0.5 && val <= 1.5) {
                  updateField('pitch', val);
                }
              }}
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderKnowledge = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.label}>KNOWLEDGE NODE (URL)</Text>
        <View style={styles.urlInputContainer}>
          <TextInput
            style={styles.urlInput}
            value={urlInput}
            onChangeText={setUrlInput}
            placeholder="https://..."
            placeholderTextColor={COLORS.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.indexButton} onPress={addKnowledgeUrl}>
            <Text style={styles.indexButtonText}>INDEX</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>INGEST DOCUMENTS</Text>
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={() =>
            Alert.alert('Coming Soon', 'Document upload will be added in next update')
          }
        >
          <Text style={styles.uploadIcon}>📄</Text>
          <Text style={styles.uploadText}>UPLOAD DATA SOURCE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Knowledge sources feature coming soon. This will allow you to add custom
          documents and URLs to enhance FREDO's knowledge base.
        </Text>
      </View>
    </ScrollView>
  );

  const renderHistory = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search history and message archives..."
          placeholderTextColor={COLORS.textSecondary}
          value={historySearch}
          onChangeText={setHistorySearch}
        />
      </View>

      {filteredHistory.map((conv) => (
        <View key={conv.id} style={styles.historyItem}>
          <View>
            <Text style={styles.historyTitle}>{conv.title}</Text>
            <Text style={styles.historyMeta}>
              {conv.messages.length} Messages •{' '}
              {new Date(conv.lastUpdate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      ))}

      {filteredHistory.length === 0 && (
        <Text style={styles.emptyText}>No archive results found.</Text>
      )}
    </ScrollView>
  );

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
          <Text style={styles.headerSubtitle}>
            AGENT CONTROL NODE
            {showSaved && (
              <Text style={styles.savedIndicator}> synced...</Text>
            )}
          </Text>
          <TextInput
            style={styles.headerTitle}
            value={agent.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Identity Label"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['core', 'knowledge', 'history'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'core' && renderCore()}
      {activeTab === 'knowledge' && renderKnowledge()}
      {activeTab === 'history' && renderHistory()}
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
  headerSubtitle: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  savedIndicator: {
    color: '#10b981',
    fontStyle: 'italic',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    color: COLORS.text,
    fontSize: 14,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  voiceContainer: {
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
  },
  voiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  voiceButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  voiceButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  voiceButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  voiceButtonTextActive: {
    color: '#000',
  },
  sliderSection: {
    marginTop: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  sliderValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sliderInput: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  urlInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  indexButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: 'center',
  },
  indexButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  uploadArea: {
    height: 150,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  infoBox: {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 18,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  historyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  historyMeta: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default AgentSettingsScreen;
