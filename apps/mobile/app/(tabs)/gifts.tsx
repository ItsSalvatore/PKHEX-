import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useState } from 'react';
import { createBuiltinMysteryGiftDatabase, MysteryGiftType } from '@pkhex/core';

export default function GiftsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const db = createBuiltinMysteryGiftDatabase();

  const filteredGifts = searchQuery
    ? db.gifts.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.speciesName && g.speciesName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : db.gifts;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search mystery gifts..."
        placeholderTextColor="#5a5f85"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredGifts.map(gift => (
          <TouchableOpacity key={gift.id} style={styles.giftCard} activeOpacity={0.7}>
            <View style={styles.giftIcon}>
              {gift.species ? (
                <Image
                  source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${gift.species}.png` }}
                  style={styles.sprite}
                />
              ) : (
                <Text style={styles.giftEmoji}>🎁</Text>
              )}
            </View>
            <View style={styles.giftInfo}>
              <View style={styles.giftHeader}>
                <Text style={styles.giftTitle} numberOfLines={1}>{gift.title}</Text>
                {gift.isShiny && <Text style={styles.shinyBadge}>✨</Text>}
              </View>
              <Text style={styles.giftDesc} numberOfLines={1}>{gift.description}</Text>
              <View style={styles.giftMeta}>
                <Text style={styles.giftGen}>Gen {gift.generation}</Text>
                {gift.isActive && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0d1e', padding: 16 },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    color: '#fff', fontSize: 14, marginBottom: 16,
  },
  giftCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 8,
  },
  giftIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  sprite: { width: 40, height: 40 },
  giftEmoji: { fontSize: 24 },
  giftInfo: { flex: 1 },
  giftHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  giftTitle: { color: '#fff', fontSize: 14, fontWeight: '700', flex: 1 },
  shinyBadge: { fontSize: 12 },
  giftDesc: { color: '#5a5f85', fontSize: 12, marginTop: 2 },
  giftMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  giftGen: { color: '#5a5f85', fontSize: 10 },
  activeBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)',
  },
  activeBadgeText: { color: '#4ade80', fontSize: 10, fontWeight: '600' },
});
