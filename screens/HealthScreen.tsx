import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { HealthReading, Medication } from '../types';

export default function HealthScreen() {
  const [healthReadings, setHealthReadings] = useState<HealthReading[]>([]);
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 'm1',
      name: 'Omnipod Check',
      dosage: 'Protocol',
      frequency: 'Ongoing',
      reminderEnabled: true,
    },
  ]);
  const [showAddReading, setShowAddReading] = useState(false);
  const [newReading, setNewReading] = useState({ type: 'glucose', value: '' });

  useEffect(() => {
    loadHealthData();
  }, []);

  useEffect(() => {
    saveHealthData();
  }, [healthReadings, medications]);

  const loadHealthData = async () => {
    try {
      const readings = await AsyncStorage.getItem('health_readings');
      const meds = await AsyncStorage.getItem('medications');
      if (readings) setHealthReadings(JSON.parse(readings));
      if (meds) setMedications(JSON.parse(meds));
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const saveHealthData = async () => {
    try {
      await AsyncStorage.setItem('health_readings', JSON.stringify(healthReadings));
      await AsyncStorage.setItem('medications', JSON.stringify(medications));
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  };

  const addReading = () => {
    if (!newReading.value) return;

    const reading: HealthReading = {
      id: Date.now().toString(),
      type: newReading.type as any,
      value: parseFloat(newReading.value),
      timestamp: Date.now(),
    };

    setHealthReadings(prev => [reading, ...prev]);
    setNewReading({ type: 'glucose', value: '' });
    setShowAddReading(false);
  };

  const getLatestReading = (type: string) => {
    const reading = healthReadings.find(r => r.type === type);
    return reading ? reading.value : '--';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Glucose</Text>
          <Text style={styles.statValue}>{getLatestReading('glucose')}</Text>
          <Text style={styles.statUnit}>mg/dL</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>{getLatestReading('weight')}</Text>
          <Text style={styles.statUnit}>lbs</Text>
        </View>
      </View>

      {/* Add Reading Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddReading(!showAddReading)}
      >
        <Text style={styles.addButtonText}>
          {showAddReading ? '− Cancel' : '+ Add Reading'}
        </Text>
      </TouchableOpacity>

      {/* Add Reading Form */}
      {showAddReading && (
        <View style={styles.addForm}>
          <Text style={styles.formLabel}>Type:</Text>
          <View style={styles.typeButtons}>
            {['glucose', 'weight', 'systolic', 'diastolic'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  newReading.type === type && styles.typeButtonActive,
                ]}
                onPress={() => setNewReading({ ...newReading, type })}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    newReading.type === type && styles.typeButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.formLabel}>Value:</Text>
          <TextInput
            style={styles.input}
            value={newReading.value}
            onChangeText={value => setNewReading({ ...newReading, value })}
            placeholder="Enter value..."
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.submitButton} onPress={addReading}>
            <Text style={styles.submitButtonText}>Log Reading</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Medications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medications</Text>
        {medications.map(med => (
          <View key={med.id} style={styles.medCard}>
            <Text style={styles.medName}>{med.name}</Text>
            <Text style={styles.medDetails}>
              {med.dosage} • {med.frequency}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent Readings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Readings</Text>
        {healthReadings.length === 0 ? (
          <Text style={styles.emptyText}>No readings yet. Add your first one!</Text>
        ) : (
          healthReadings.slice(0, 10).map(reading => (
            <View key={reading.id} style={styles.readingCard}>
              <View>
                <Text style={styles.readingType}>{reading.type.toUpperCase()}</Text>
                <Text style={styles.readingDate}>
                  {new Date(reading.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.readingValue}>{reading.value}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  statUnit: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addForm: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  formLabel: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    color: COLORS.text,
    fontSize: 12,
  },
  typeButtonTextActive: {
    color: COLORS.background,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  medCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  medName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  medDetails: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  readingCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingType: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  readingDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  readingValue: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});
