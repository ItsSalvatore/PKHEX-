import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Save File</Text>
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <View>
            <Text style={styles.rowTitle}>Load Save</Text>
            <Text style={styles.rowDesc}>Open a Pokémon save file</Text>
          </View>
          <Text style={styles.rowArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <View>
            <Text style={styles.rowTitle}>Export Save</Text>
            <Text style={styles.rowDesc}>Save changes to file</Text>
          </View>
          <Text style={styles.rowArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>Dark Mode</Text>
            <Text style={styles.rowDesc}>Use dark color scheme</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#363b5e', true: '#6366f1' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>PKHeX Mobile</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutDesc}>
            Cross-platform Pokémon save file editor.
            Built with React Native and Expo.
          </Text>
          <Text style={styles.aboutDesc}>
            Core logic ported from PKHeX by kwsch.
            Supports Generations 1-9.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0d1e', padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: '#5a5f85', fontSize: 12, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 10, paddingLeft: 4,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 8,
  },
  rowTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  rowDesc: { color: '#5a5f85', fontSize: 12, marginTop: 2 },
  rowArrow: { color: '#5a5f85', fontSize: 18 },
  aboutCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  aboutTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 2 },
  aboutVersion: { color: '#818cf8', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  aboutDesc: { color: '#5a5f85', fontSize: 13, lineHeight: 20, marginBottom: 8 },
});
