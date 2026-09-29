import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BuscarScreen from './screens/BuscarScreen';
import MapaClimaScreen from './screens/MapaClimaScreen';

// Definimos los dos estados posibles de nuestra navegación
type Tab = 'buscar' | 'mapa';

export default function App() {
  // El estado inicial será la pantalla de buscar
  const [tab, setTab] = useState<Tab>('buscar');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* Contenedor principal: renderiza condicionalmente la pantalla */}
      <View style={{ flex: 1 }}>
        {tab === 'buscar' ? <BuscarScreen /> : <MapaClimaScreen />}
      </View>

      {/* Barra de pestañas inferior */}
      <View style={styles.tabBar}>
        <Pressable 
          style={[styles.tabButton, tab === 'buscar' && styles.tabButtonActive]} 
          onPress={() => setTab('buscar')}
        >
          <Text style={[styles.tabText, tab === 'buscar' && styles.tabTextActive]}>Buscar</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.tabButton, tab === 'mapa' && styles.tabButtonActive]} 
          onPress={() => setTab('mapa')}
        >
          <Text style={[styles.tabText, tab === 'mapa' && styles.tabTextActive]}>Mapa</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f9fa'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center'
  },
  tabButtonActive: {
    borderTopWidth: 3,
    borderTopColor: '#e63946',
    marginTop: -1
  },
  tabText: {
    fontSize: 16,
    color: '#6c757d'
  },
  tabTextActive: {
    color: '#e63946',
    fontWeight: 'bold'
  }
});