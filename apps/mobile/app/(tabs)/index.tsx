import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient' ;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>P</Text>
        </View>
        <Text style={styles.title}>PKHeX</Text>
        <Text style={styles.subtitle}>Pokémon Save Editor</Text>
      </View>

      <TouchableOpacity
        style={styles.loadButton}
        onPress={() => {/* Document picker */}}
        activeOpacity={0.8}
      >
        <Text style={styles.loadButtonText}>Load Save File</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        {[
          { label: 'Party', desc: 'Your active team', screen: 'boxes' as const },
          { label: 'PC Boxes', desc: 'Storage Pokémon', screen: 'boxes' as const },
          { label: 'Mystery Gifts', desc: 'Gift database', screen: 'gifts' as const },
          { label: 'Settings', desc: 'App preferences', screen: 'settings' as const },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            onPress={() => router.push(`/(tabs)/${item.screen}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>{item.label}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Privacy First</Text>
        <Text style={styles.infoText}>
          All editing happens locally on your device. Your save files are never uploaded.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0d1e',
    padding: 20,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  iconText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5a5f85',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loadButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    color: '#5a5f85',
    fontSize: 12,
  },
  infoBox: {
    backgroundColor: 'rgba(234,179,8,0.06)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.1)',
    marginBottom: 40,
  },
  infoTitle: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    color: '#5a5f85',
    fontSize: 12,
    lineHeight: 18,
  },
});
