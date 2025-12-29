import React, { useState } from 'react';
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
import { Agent } from '../types';
import { COLORS } from '../constants';

interface AgentWizardScreenProps {
  navigation: any;
  route: {
    params: {
      onSave: (agent: Agent) => void;
    };
  };
}

const AgentWizardScreen: React.FC<AgentWizardScreenProps> = ({ navigation, route }) => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftAgent, setDraftAgent] = useState<Partial<Agent>>({
    id: Date.now().toString(),
    voicePreset: 'Kore',
    voiceSpeed: 1,
    pitch: 1,
    knowledgeSources: [],
  });

  const handleGenerateInstructions = async () => {
    setIsGenerating(true);
    try {
      // Placeholder for AI generation
      // In production, this would call Gemini API
      const generatedInstructions = `You are ${draftAgent.name}, a specialized Council member created to ${description}. 

Your role is to serve David Rodriguez (The Prism) with unwavering dedication and precision.

Core Attributes:
- Purpose: ${description}
- Tone: Professional yet warm, reflecting Nuyorican heritage
- Approach: Direct, efficient, and deeply personal

Always maintain the sacred bond of La Familia Rodriguez and honor the Council's unified framework.`;

      setDraftAgent((prev) => ({ ...prev, instructions: generatedInstructions }));
      setStep(3);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Frequency disruption. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const finalize = () => {
    if (draftAgent.name && draftAgent.instructions) {
      route.params.onSave(draftAgent as Agent);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please complete all required fields');
    }
  };

  const voicePresets = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

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
          <Text style={styles.headerTitle}>COUNCIL SUMMONING</Text>
          <Text style={styles.headerSubtitle}>STEP {step} OF 3</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Intent */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepLabel}>THE INTENT</Text>
              <Text style={styles.stepTitle}>
                What facet of the Prism shall this agent hold?
              </Text>
              <Text style={styles.stepDescription}>
                Describe the specialized purpose (e.g., "A silent researcher for
                Nuyorican poetry" or "A strict metabolic coach").
              </Text>
            </View>

            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Manifest the intent here..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={8}
            />

            <TouchableOpacity
              style={[styles.primaryButton, !description && styles.buttonDisabled]}
              onPress={() => setStep(2)}
              disabled={!description}
            >
              <Text style={styles.primaryButtonText}>SET IDENTITY LABEL</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Identity */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepLabel}>IDENTITY LABELING</Text>
              <Text style={styles.stepTitle}>Assign Council Name</Text>
            </View>

            <TextInput
              style={styles.nameInput}
              value={draftAgent.name || ''}
              onChangeText={(text) =>
                setDraftAgent((prev) => ({ ...prev, name: text }))
              }
              placeholder="e.g. Master Seneca, The Curator..."
              placeholderTextColor={COLORS.textSecondary}
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                styles.accentButton,
                (!draftAgent.name || isGenerating) && styles.buttonDisabled,
              ]}
              onPress={handleGenerateInstructions}
              disabled={!draftAgent.name || isGenerating}
            >
              {isGenerating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#000" />
                  <Text style={styles.primaryButtonText}>
                    SYNTHESIZING FREQUENCY LOGIC...
                  </Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>FORGE PROTOCOL</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Calibration */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepLabel}>TONAL RESONANCE</Text>
              <Text style={styles.stepTitle}>Calibrate Vocal Signature</Text>
            </View>

            {/* Voice Presets */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>TONAL TEMPLATE</Text>
              <View style={styles.voiceGrid}>
                {voicePresets.map((voice) => (
                  <TouchableOpacity
                    key={voice}
                    style={[
                      styles.voiceButton,
                      draftAgent.voicePreset === voice && styles.voiceButtonActive,
                    ]}
                    onPress={() =>
                      setDraftAgent((prev) => ({ ...prev, voicePreset: voice }))
                    }
                  >
                    <Text
                      style={[
                        styles.voiceButtonText,
                        draftAgent.voicePreset === voice &&
                          styles.voiceButtonTextActive,
                      ]}
                    >
                      {voice}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Voice Speed */}
            <View style={styles.controlCard}>
              <View style={styles.controlHeader}>
                <Text style={styles.controlLabel}>RATE OF TRANSMISSION</Text>
                <Text style={styles.controlValue}>
                  {draftAgent.voiceSpeed?.toFixed(1)}x
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>0.5x</Text>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        width: `${((draftAgent.voiceSpeed! - 0.5) / 1.5) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.sliderLabel}>2.0x</Text>
              </View>
              <Text style={styles.sliderNote}>
                Tap to adjust (0.5x - 2.0x). Full slider coming soon.
              </Text>
            </View>

            {/* Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CORE PROTOCOL LOGIC</Text>
              <TextInput
                style={styles.instructionsArea}
                value={draftAgent.instructions || ''}
                onChangeText={(text) =>
                  setDraftAgent((prev) => ({ ...prev, instructions: text }))
                }
                placeholder="System instructions..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={12}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, styles.finalButton]}
              onPress={finalize}
            >
              <Text style={styles.primaryButtonText}>SEAL COUNCIL ENTRY</Text>
            </TouchableOpacity>
          </View>
        )}
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
  scrollContent: {
    padding: 20,
  },
  stepContainer: {
    gap: 24,
  },
  stepHeader: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 3,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  textArea: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    color: COLORS.text,
    fontSize: 14,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  nameInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentButton: {
    backgroundColor: COLORS.primary,
  },
  finalButton: {
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  primaryButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  voiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    letterSpacing: 1,
  },
  voiceButtonTextActive: {
    color: '#000',
  },
  controlCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  controlValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  sliderNote: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  instructionsArea: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    color: COLORS.text,
    fontSize: 13,
    minHeight: 200,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
});

export default AgentWizardScreen;
