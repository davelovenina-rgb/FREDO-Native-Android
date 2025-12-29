import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { COLORS } from '../constants';

// Existing Screens
import HomeScreen from '../screens/HomeScreen';
import HealthScreen from '../screens/HealthScreen';
import SpiritualScreen from '../screens/SpiritualScreen';
import MediaScreen from '../screens/MediaScreen';
import DriveScreen from '../screens/DriveScreen';
import TasksScreen from '../screens/TasksScreen';
import NotesScreen from '../screens/NotesScreen';
import MemoriesScreen from '../screens/MemoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// New Screens - Phase 3-5
import DashboardScreen from '../screens/DashboardScreen';
import ActionMenuScreen from '../screens/ActionMenuScreen';
import ApiVaultScreen from '../screens/ApiVaultScreen';
import AgentSettingsScreen from '../screens/AgentSettingsScreen';
import RemindersScreen from '../screens/RemindersScreen';
import AdvancedSettingsScreen from '../screens/AdvancedSettingsScreen';

// New Screens - Phase 6-7 (Additional Features)
import AgentWizardScreen from '../screens/AgentWizardScreen';
import FoldersScreen from '../screens/FoldersScreen';
import FolderDetailScreen from '../screens/FolderDetailScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
        },
        headerStyle: {
          backgroundColor: COLORS.background,
          borderBottomColor: COLORS.border,
          borderBottomWidth: 1,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: COLORS.primary,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'FREDO',
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{
          title: 'Health',
          tabBarLabel: 'Health',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>❤️</Text>,
        }}
      />
      <Tab.Screen
        name="Spiritual"
        component={SpiritualScreen}
        options={{
          title: 'Spiritual',
          tabBarLabel: 'Spirit',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🙏</Text>,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreDrawer}
        options={{
          title: 'More',
          tabBarLabel: 'More',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⋯</Text>,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function MoreDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: COLORS.background,
        },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.textSecondary,
        headerStyle: {
          backgroundColor: COLORS.background,
          borderBottomColor: COLORS.border,
          borderBottomWidth: 1,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: COLORS.primary,
        },
      }}
    >
      {/* Quick Actions */}
      <Drawer.Screen
        name="ActionMenu"
        component={ActionMenuScreen}
        options={{
          title: 'Action Menu',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⚡</Text>,
        }}
      />
      
      {/* Content Sections */}
      <Drawer.Screen
        name="Media"
        component={MediaScreen}
        options={{
          title: 'Media Registry',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📚</Text>,
        }}
      />
      <Drawer.Screen
        name="Drive"
        component={DriveScreen}
        options={{
          title: 'Drive Mode',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🚗</Text>,
        }}
      />
      <Drawer.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: 'Tasks',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>✓</Text>,
        }}
      />
      <Drawer.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          title: 'Notes',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📝</Text>,
        }}
      />
      <Drawer.Screen
        name="Memories"
        component={MemoriesScreen}
        options={{
          title: 'Neural Memories',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🧠</Text>,
        }}
      />
      <Drawer.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          title: 'Reminders',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔔</Text>,
        }}
      />
      <Drawer.Screen
        name="Folders"
        component={FoldersScreen}
        options={{
          title: 'Folders',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📁</Text>,
        }}
      />
      
      {/* System Settings */}
      <Drawer.Screen
        name="ApiVault"
        component={ApiVaultScreen}
        options={{
          title: 'API Vault',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔑</Text>,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⚙️</Text>,
        }}
      />
      <Drawer.Screen
        name="AdvancedSettings"
        component={AdvancedSettingsScreen}
        options={{
          title: 'Advanced Settings',
          drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔧</Text>,
        }}
      />
    </Drawer.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainApp" component={MainTabs} />
      <Stack.Screen name="AgentSettings" component={AgentSettingsScreen} />
      <Stack.Screen name="AgentWizard" component={AgentWizardScreen} />
      <Stack.Screen name="FolderDetail" component={FolderDetailScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
