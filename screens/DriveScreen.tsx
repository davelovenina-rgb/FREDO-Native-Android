import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { Trip } from '../types';

export default function DriveScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    saveTrips();
  }, [trips]);

  const loadTrips = async () => {
    try {
      const saved = await AsyncStorage.getItem('trips');
      if (saved) {
        const loadedTrips = JSON.parse(saved);
        setTrips(loadedTrips);
        const active = loadedTrips.find((t: Trip) => t.isActive);
        setActiveTrip(active || null);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  };

  const saveTrips = async () => {
    try {
      await AsyncStorage.setItem('trips', JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  };

  const startTrip = () => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      startTime: Date.now(),
      isActive: true,
    };
    setTrips(prev => [newTrip, ...prev]);
    setActiveTrip(newTrip);
  };

  const endTrip = () => {
    if (!activeTrip) return;

    const updatedTrips = trips.map(trip =>
      trip.id === activeTrip.id
        ? { ...trip, endTime: Date.now(), isActive: false }
        : trip
    );
    setTrips(updatedTrips);
    setActiveTrip(null);
  };

  const formatDuration = (start: number, end?: number) => {
    const duration = (end || Date.now()) - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Active Trip */}
      {activeTrip ? (
        <View style={styles.activeTrip}>
          <View style={styles.activeTripHeader}>
            <Text style={styles.activeTripTitle}>🚗 TRIP IN PROGRESS</Text>
            <View style={styles.pulseIndicator} />
          </View>
          <Text style={styles.activeTripTime}>
            {formatDuration(activeTrip.startTime)}
          </Text>
          <Text style={styles.activeTripStart}>
            Started: {new Date(activeTrip.startTime).toLocaleTimeString()}
          </Text>
          <TouchableOpacity style={styles.endButton} onPress={endTrip}>
            <Text style={styles.endButtonText}>End Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.startButton} onPress={startTrip}>
          <Text style={styles.startButtonText}>🚗 Start New Trip</Text>
        </TouchableOpacity>
      )}

      {/* Trip History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip History</Text>
        {trips.filter(t => !t.isActive).length === 0 ? (
          <Text style={styles.emptyText}>No completed trips yet.</Text>
        ) : (
          trips
            .filter(t => !t.isActive)
            .map(trip => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <Text style={styles.tripDate}>
                    {new Date(trip.startTime).toLocaleDateString()}
                  </Text>
                  <Text style={styles.tripDuration}>
                    {formatDuration(trip.startTime, trip.endTime)}
                  </Text>
                </View>
                <Text style={styles.tripTime}>
                  {new Date(trip.startTime).toLocaleTimeString()} -{' '}
                  {trip.endTime
                    ? new Date(trip.endTime).toLocaleTimeString()
                    : 'In Progress'}
                </Text>
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
  activeTrip: {
    margin: 16,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  activeTripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeTripTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  pulseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  activeTripTime: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  activeTripStart: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 20,
  },
  endButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    margin: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  startButtonText: {
    color: COLORS.background,
    fontSize: 20,
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
  tripCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDate: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripDuration: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripTime: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});
