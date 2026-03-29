import { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const GEN_LABELS: Record<number, string> = {
  3: 'Gen 3', 4: 'Gen 4', 5: 'Gen 5', 6: 'Gen 6', 7: 'Gen 7', 8: 'Gen 8', 9: 'Gen 9',
};

interface SimpleCheat {
  id: number;
  game: string;
  gen: number;
  category: string;
  name: string;
  desc: string;
  codeType: string;
  codes: string[];
  needsMaster: boolean;
  note?: string;
  warning?: string;
}

const CHEAT_DB: SimpleCheat[] = [
  { id: 1, game: 'Emerald', gen: 3, category: 'Master Code', name: 'Master Code', desc: 'Required before GameShark codes', codeType: 'GameShark', codes: ['D8BAE4D9 4864DCE5', 'A86CDBA5 19BA49B3'], needsMaster: false },
  { id: 2, game: 'Emerald', gen: 3, category: 'Walk Through Walls', name: 'Walk Through Walls', desc: 'Move through any solid object', codeType: 'GameShark', codes: ['7881A409 E2026E0C', '8E883EFF 92E9660D'], needsMaster: true },
  { id: 3, game: 'Emerald', gen: 3, category: 'Rare Candy', name: 'Rare Candy in PC', desc: 'Rare Candy added to PC storage', codeType: 'GameShark', codes: ['BFF956FA 2F9EC50D'], needsMaster: true },
  { id: 4, game: 'Emerald', gen: 3, category: 'Master Ball', name: 'Master Ball in PC', desc: 'Master Ball added to PC storage', codeType: 'GameShark', codes: ['128898B6 EDA43037'], needsMaster: true },
  { id: 5, game: 'Emerald', gen: 3, category: 'Infinite Money', name: 'Infinite Money', desc: 'Max out money at ₽999999', codeType: 'GameShark', codes: ['29C78059 96542194'], needsMaster: true },
  { id: 6, game: 'Emerald', gen: 3, category: 'Shiny Pokémon', name: 'Shiny Wild Pokémon', desc: 'All wild encounters are shiny', codeType: 'GameShark', codes: ['F3A9A86D 4E2629B4', '18452A7D DDE55BCC'], needsMaster: true },
  { id: 7, game: 'Platinum', gen: 4, category: 'Walk Through Walls', name: 'Walk Through Walls', desc: 'Walk through walls and barriers', codeType: 'Action Replay', codes: ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', '0000008C 00000001', 'D2000000 00000000'], needsMaster: false, note: 'Press R+B to activate' },
  { id: 8, game: 'Platinum', gen: 4, category: 'Rare Candy', name: '900x Medicine Items', desc: 'Press L+R for Rare Candy & medicine', codeType: 'Action Replay', codes: ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', 'D5000000 03840011', 'C0000000 00000025', 'D6000000 00000B74', 'D4000000 00000001', 'D2000000 00000000'], needsMaster: false, note: 'Press L+R' },
  { id: 9, game: 'Platinum', gen: 4, category: 'Infinite Money', name: 'Max Money', desc: 'Max out wallet to ₽999999', codeType: 'Action Replay', codes: ['94000130 FCFF0000', '62101D40 00000000', 'B2101D40 00000000', '00000090 000F423F', 'D2000000 00000000'], needsMaster: false, note: 'Press L+R' },
  { id: 10, game: 'Platinum', gen: 4, category: '100% Catch Rate', name: '100% Catch Rate', desc: 'Catch any Pokémon guaranteed', codeType: 'Action Replay', codes: ['9224A948 00002801', '1224A948 00004280', 'D2000000 00000000'], needsMaster: false },
  { id: 11, game: 'Platinum', gen: 4, category: 'Shiny Pokémon', name: 'Shiny Encounters', desc: 'All wild encounters are shiny', codeType: 'Action Replay', codes: ['12068AC6 000046C0'], needsMaster: false, warning: 'Disable after catching' },
  { id: 12, game: 'HeartGold', gen: 4, category: 'Rare Candy', name: '999x Rare Candy', desc: 'Press L+R for 999 Rare Candies', codeType: 'Action Replay', codes: ['94000130 FCFF0000', '62111880 00000000', 'B2111880 00000000', '00000F4C 03E70032', 'D2000000 00000000'], needsMaster: false, note: 'Press L+R' },
  { id: 13, game: 'Black', gen: 5, category: 'Infinite Money', name: 'Max Money', desc: 'Press SELECT for max money', codeType: 'Action Replay', codes: ['94000130 FFFB0000', '0223CDCC 0098967F', 'D2000000 00000000'], needsMaster: false, note: 'Press SELECT' },
  { id: 14, game: 'Black', gen: 5, category: 'Rare Candy', name: '900x Rare Candy', desc: 'Press SELECT for Rare Candies', codeType: 'Action Replay', codes: ['94000130 FFFB0000', '0223CDAC 03840032', 'D2000000 00000000'], needsMaster: false, note: 'Press SELECT' },
  { id: 15, game: 'Black', gen: 5, category: 'Shiny Pokémon', name: 'Shiny Wild Pokémon', desc: 'All wild encounters are shiny', codeType: 'Action Replay', codes: ['521A96D8 1C221C33', '021A96D8 2C001C22', 'D2000000 00000000'], needsMaster: false },
  { id: 16, game: 'White', gen: 5, category: 'Infinite Money', name: 'Max Money', desc: 'Press SELECT for max money', codeType: 'Action Replay', codes: ['94000130 FFFB0000', '0223CDCC 0098967F', 'D2000000 00000000'], needsMaster: false, note: 'Press SELECT' },
  { id: 17, game: 'Diamond', gen: 4, category: '100% Catch Rate', name: '100% Catch Rate', desc: 'Catch any wild Pokémon', codeType: 'Action Replay', codes: ['9224A948 00002801', '1224A948 00004280', 'D2000000 00000000'], needsMaster: false },
  { id: 18, game: 'Diamond', gen: 4, category: 'Infinite Money', name: 'Max Money', desc: 'Press L+R to max money', codeType: 'Action Replay', codes: ['94000130 FCFF0000', 'B21C4D28 00000000', 'B0000004 00000000', '000000F8 000F423F', 'D2000000 00000000'], needsMaster: false, note: 'Press L+R' },
  { id: 19, game: 'FireRed', gen: 3, category: 'Walk Through Walls', name: 'Walk Through Walls', desc: 'Move through solid objects', codeType: 'GameShark', codes: ['509197D3 542975F4', '78DA95DF 44018CB4'], needsMaster: true },
  { id: 20, game: 'FireRed', gen: 3, category: 'Infinite Money', name: 'Infinite Money', desc: 'Max money ₽999999', codeType: 'GameShark', codes: ['29C78059 96542194'], needsMaster: true },
];

export default function CheatsScreen() {
  const [search, setSearch] = useState('');
  const [genFilter, setGenFilter] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let result = CHEAT_DB;
    if (genFilter !== null) result = result.filter(c => c.gen === genFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.game.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }
    return result;
  }, [search, genFilter]);

  const copyCode = async (cheat: SimpleCheat) => {
    const text = cheat.codes.join('\n');
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `${cheat.name} codes copied to clipboard`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0d1f' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 }}>
          Action Replay Codes
        </Text>
        <Text style={{ fontSize: 12, color: '#5a5f85', marginBottom: 16 }}>
          {CHEAT_DB.length} codes from PokemonCoders & community
        </Text>

        <TextInput
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, color: '#fff', fontSize: 14, marginBottom: 12 }}
          placeholder="Search cheats..." placeholderTextColor="#5a5f85"
          value={search} onChangeText={setSearch}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <TouchableOpacity onPress={() => setGenFilter(null)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, marginRight: 8, backgroundColor: genFilter === null ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.04)' }}>
            <Text style={{ color: genFilter === null ? '#fb7185' : '#5a5f85', fontSize: 12, fontWeight: '600' }}>All</Text>
          </TouchableOpacity>
          {[3, 4, 5, 6, 7, 8, 9].map(g => (
            <TouchableOpacity key={g} onPress={() => setGenFilter(genFilter === g ? null : g)}
              style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, marginRight: 8, backgroundColor: genFilter === g ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.04)' }}>
              <Text style={{ color: genFilter === g ? '#fb7185' : '#5a5f85', fontSize: 12, fontWeight: '600' }}>{GEN_LABELS[g]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={{ fontSize: 11, color: '#5a5f85', marginBottom: 8 }}>{filtered.length} codes found</Text>

        {filtered.map(cheat => (
          <TouchableOpacity key={cheat.id} activeOpacity={0.8}
            onPress={() => setExpanded(expanded === cheat.id ? null : cheat.id)}
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: expanded === cheat.id ? 'rgba(129,140,248,0.2)' : 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{cheat.name}</Text>
                <Text style={{ fontSize: 11, color: '#5a5f85', marginTop: 2 }}>{cheat.desc}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                  <View style={{ backgroundColor: 'rgba(99,102,241,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, color: '#818cf8' }}>{cheat.game}</Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, color: '#5a5f85' }}>{cheat.codeType}</Text>
                  </View>
                  {cheat.needsMaster && (
                    <View style={{ backgroundColor: 'rgba(245,158,11,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 10, color: '#f59e0b' }}>Master Code</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {expanded === cheat.id && (
              <View style={{ marginTop: 12 }}>
                {cheat.note && (
                  <View style={{ backgroundColor: 'rgba(59,130,246,0.06)', padding: 8, borderRadius: 8, marginBottom: 8 }}>
                    <Text style={{ fontSize: 11, color: '#60a5fa' }}>{cheat.note}</Text>
                  </View>
                )}
                {cheat.warning && (
                  <View style={{ backgroundColor: 'rgba(239,68,68,0.06)', padding: 8, borderRadius: 8, marginBottom: 8 }}>
                    <Text style={{ fontSize: 11, color: '#f87171' }}>⚠ {cheat.warning}</Text>
                  </View>
                )}
                <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' }}>
                  {cheat.codes.map((line, i) => (
                    <Text key={i} style={{ fontFamily: 'monospace', fontSize: 13, color: '#34d399', lineHeight: 20 }}>{line}</Text>
                  ))}
                </View>
                <TouchableOpacity onPress={() => copyCode(cheat)}
                  style={{ backgroundColor: 'rgba(244,63,94,0.1)', padding: 10, borderRadius: 10, marginTop: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#fb7185', fontSize: 13, fontWeight: '700' }}>Copy Code</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={{ backgroundColor: 'rgba(245,158,11,0.06)', padding: 14, borderRadius: 12, marginTop: 12, marginBottom: 40 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#f59e0b' }}>⚠ Use Cheats Responsibly</Text>
          <Text style={{ fontSize: 11, color: '#5a5f85', marginTop: 4, lineHeight: 16 }}>
            Always save before using codes. Use one code at a time. Some codes may cause glitches.
            For Gen 6+ use PKHeX save editing instead.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
