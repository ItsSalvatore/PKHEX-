import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';

export default function BoxesScreen() {
  const [currentBox, setCurrentBox] = useState(0);
  const totalBoxes = 32;
  const slotsPerBox = 30;

  const slots = Array.from({ length: slotsPerBox }, (_, i) => ({
    id: i,
    occupied: false,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentBox(Math.max(0, currentBox - 1))}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>
        <View style={styles.boxTitle}>
          <Text style={styles.boxName}>Box {currentBox + 1}</Text>
          <Text style={styles.boxCount}>0/{slotsPerBox}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setCurrentBox(Math.min(totalBoxes - 1, currentBox + 1))}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {slots.map(slot => (
          <TouchableOpacity key={slot.id} style={styles.slot} activeOpacity={0.6}>
            <View style={styles.emptySlot} />
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boxPicker}>
        {Array.from({ length: totalBoxes }, (_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setCurrentBox(i)}
            style={[styles.boxChip, i === currentBox && styles.boxChipActive]}
          >
            <Text style={[styles.boxChipText, i === currentBox && styles.boxChipTextActive]}>
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>Load a save file to view your Pokémon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0d1e', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  navButtonText: { color: '#fff', fontSize: 16 },
  boxTitle: { alignItems: 'center' },
  boxName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  boxCount: { color: '#5a5f85', fontSize: 12, marginTop: 2 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 6, marginBottom: 16,
  },
  slot: {
    width: '15.5%', aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  emptySlot: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  boxPicker: { marginBottom: 24 },
  boxChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10, marginRight: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  boxChipActive: {
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderColor: 'rgba(99,102,241,0.3)',
  },
  boxChipText: { color: '#5a5f85', fontSize: 12, fontWeight: '600' },
  boxChipTextActive: { color: '#818cf8' },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#5a5f85', fontSize: 14 },
});
