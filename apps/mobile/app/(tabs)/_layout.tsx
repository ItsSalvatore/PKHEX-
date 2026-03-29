import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 4,
    }}>
      <Text style={{
        fontSize: 10,
        fontWeight: focused ? '700' : '500',
        color: focused ? '#818cf8' : '#5a5f85',
        marginTop: 2,
      }}>
        {name}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0f1228',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#5a5f85',
        headerStyle: { backgroundColor: '#0f1228' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="boxes"
        options={{
          title: 'Boxes',
          tabBarIcon: ({ focused }) => <TabIcon name="Boxes" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="gifts"
        options={{
          title: 'Gifts',
          tabBarIcon: ({ focused }) => <TabIcon name="Gifts" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cheats"
        options={{
          title: 'Cheats',
          tabBarIcon: ({ focused }) => <TabIcon name="Cheats" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
