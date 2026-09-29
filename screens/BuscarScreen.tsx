import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// ¡IMPORTANTE! Reemplaza esto con la API Key real que obtuviste en OpenWeather
const API_KEY = '7f24891b0f66071b8505853bde4018a5';

export default function App() {
  const [ciudad, setCiudad] = useState('');
  const [clima, setClima] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const buscarClima = async () => {
    // 1. Iniciar estado de carga y limpiar errores previos
    setIsLoading(true);
    setErrorMessage('');
    setClima(null);

    try {
      // 2. Hacer fetch a la API construyendo la URL con la ciudad, la key, en español y en grados centígrados
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;
      const response = await fetch(url);

      // 3. Si la respuesta no es exitosa (ej. ciudad no existe), lanzar error
      if (!response.ok) {
        throw new Error('No se pudo encontrar la ciudad. Verifica el nombre.');
      }

      // 4. Si todo sale bien, guardar el resultado
      const data = await response.json();
      setClima(data);
    } catch (error: any) {
      // 5. Si falla, guardar el mensaje de error
      setErrorMessage(error.message);
    } finally {
      // 6. Al final, quitar el indicador de carga
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clima Colombia</Text>
      
      <TextInput 
        style={styles.input}
        value={ciudad} 
        onChangeText={setCiudad} 
        placeholder="Escribe una ciudad (ej. Bogota)"
      />
      
      <Pressable style={styles.button} onPress={buscarClima}>
        <Text style={styles.buttonText}>Consultar clima</Text>
      </Pressable>

      {/* Renderizado condicional según el estado */}
      
      {/* ActivityIndicator si isLoading es true */}
      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      
      {/* Text con errorMessage si existe un error */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      
      {/* View + Text con los datos si clima existe y no hay errores */}
      {clima && !isLoading && (
        <View style={styles.card}>
          <Text style={styles.temp}>{clima.main.temp}°C</Text>
          <Text style={styles.desc}>{clima.weather[0].description}</Text>
        </View>
      )}
    </View>
  );
}

// Estilos básicos para que la interfaz se vea ordenada
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#e63946', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  card: { marginTop: 30, padding: 20, backgroundColor: '#f1faee', borderRadius: 12, alignItems: 'center' },
  temp: { fontSize: 48, fontWeight: 'bold', color: '#1d3557' },
  desc: { fontSize: 20, textTransform: 'capitalize', color: '#457b9d', marginTop: 10 }
});