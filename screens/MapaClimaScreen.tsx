import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
// Importamos los datos del mapa
import { departments, MAP_HEIGHT, MAP_WIDTH } from '../src/models/colombiaDepartments';

const API_KEY = '7f24891b0f66071b8505853bde4018a5';

// Función individual para buscar el clima de UNA ciudad
const getWeatherByCity = async (city: string) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error en ${city}`);
  return response.json();
};

// Función para consultar todas las ciudades en paralelo usando Promise.allSettled
export async function getWeatherForCities(cities: string[]) {
  const results = new Map<string, any>();
  const promises = cities.map(city => getWeatherByCity(city));
  const settledResults = await Promise.allSettled(promises);
  
  settledResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      results.set(cities[index], result.value);
    } else {
      results.set(cities[index], null);
    }
  });
  return results;
}

// Lógica para asignar un color según la temperatura
const getColorForTemp = (temp: number | undefined) => {
  if (temp === undefined) return '#e0e0e0'; // Gris si no hay datos
  if (temp <= 15) return '#457b9d'; // Azul para frío
  if (temp <= 25) return '#f4a261'; // Naranja para templado
  return '#e63946'; // Rojo para cálido
};

export default function MapaClimaScreen() {
  const [weatherData, setWeatherData] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  useEffect(() => {
    const cargarClima = async () => {
      setIsLoading(true);
      const cities = departments.map(dept => dept.name);
      const data = await getWeatherForCities(cities);
      setWeatherData(data);
      setIsLoading(false);
    };
    cargarClima();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={{ marginTop: 10 }}>Cargando clima nacional...</Text>
      </View>
    );
  }

  const selectedWeatherData = selectedDept ? weatherData.get(selectedDept) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clima por Departamento</Text>

      {/* RETO ADICIONAL: Leyenda Visual */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#457b9d' }]} />
          <Text style={styles.legendText}>Frío</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#f4a261' }]} />
          <Text style={styles.legendText}>Templado</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#e63946' }]} />
          <Text style={styles.legendText}>Cálido</Text>
        </View>
      </View>
      
      {/* Contenedor del Mapa SVG */}
      <View style={styles.mapContainer}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
          {departments.map((dept, index) => {
            const deptWeather = weatherData.get(dept.name);
            const temp = deptWeather ? deptWeather.main.temp : undefined;
            const fillColor = getColorForTemp(temp);

            return (
              <Path
                key={index}
                d={dept.path}
                fill={fillColor} 
                stroke="#ffffff"
                strokeWidth="2"
                onPress={() => setSelectedDept(dept.name)}
              />
            );
          })}
        </Svg>
      </View>

      {/* Tarjeta de detalle flotante */}
      {selectedDept && (
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.cardTitle}>{selectedDept}</Text>
            <Pressable onPress={() => setSelectedDept(null)}>
              <Text style={styles.closeBtn}>X</Text>
            </Pressable>
          </View>
          
          {selectedWeatherData ? (
            <View>
              <Text style={styles.temp}>{selectedWeatherData.main.temp}°C</Text>
              <Text style={styles.desc}>{selectedWeatherData.weather[0].description}</Text>
            </View>
          ) : (
            <Text style={styles.errorText}>Datos no disponibles para esta zona</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  mapContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  // Estilos del reto adicional (leyenda)
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  legendText: {
    fontSize: 14,
    color: '#1d3557',
    fontWeight: '500'
  },

  // Estilos de la tarjeta flotante
  card: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#f1faee',
    padding: 20,
    borderRadius: 12,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1d3557' },
  closeBtn: { fontSize: 18, fontWeight: 'bold', color: '#e63946', padding: 5 },
  temp: { fontSize: 32, fontWeight: 'bold', color: '#1d3557', marginTop: 10 },
  desc: { fontSize: 16, textTransform: 'capitalize', color: '#457b9d' },
  errorText: { color: 'red', marginTop: 10 }
});