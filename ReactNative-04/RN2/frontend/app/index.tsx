// app/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const API_URL = 'http://localhost:3000';
 // Cambiar si tu backend está en otra IP

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 12 },
  debugBox: { backgroundColor: '#f5f5f5', padding: 10, borderRadius: 8, marginTop: 20, width: '100%' },
  debugText: { fontSize: 10, color: '#666', fontFamily: 'Courier New' },
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState('');
  const [initialized, setInitialized] = useState(false);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '730371176837-c10m8pjdted45pa39ir8h006pv4tgplr.apps.googleusercontent.com',
    redirectUri: 'http://localhost:8081',
  });

  const router = useRouter();

  const addDebug = (msg: string) => setDebug((prev) => prev + '\n' + msg);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          addDebug('✓ Sesión encontrada, redirigiendo...');
          router.replace('/(tabs)/home');
        } else {
          addDebug('ℹ️ No hay sesión guardada');
        }
      } catch (err: any) {
        addDebug('❌ Error al leer sesión: ' + err.message);
      } finally {
        setInitialized(true);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    if (response?.type === 'success') {
      addDebug('✓ Respuesta de Google recibida');
      const token = response.authentication?.idToken || response.authentication?.accessToken;
      if (token) handleGoogleAuth(token);
      else {
        addDebug('❌ No se recibió token');
        Alert.alert('Error', 'No se recibió token de Google');
        setLoading(false);
      }
    } else if (response?.type === 'error') {
      addDebug('❌ Error de Google: ' + (response.error?.message || 'desconocido'));
      Alert.alert('Error', 'Error al autenticarse con Google');
      setLoading(false);
    }
  }, [response, initialized]);

  const handleGoogleAuth = async (token: string) => {
    try {
      setLoading(true);
      addDebug('📤 Enviando token al backend...');
      addDebug('🔗 URL: ' + API_URL + '/api/auth/google');

      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      });

      addDebug('📦 Respuesta backend: ' + res.status);

      const data = await res.json();

      if (!res.ok) {
        addDebug('❌ ' + data.error);
        setLoading(false);
        return;
      }

      addDebug('✓ Autenticación exitosa, guardando token...');
      await AsyncStorage.setItem('authToken', data.token);

      addDebug('✓ Token guardado, redirigiendo...');
      router.replace('/(tabs)/home');
    } catch (err: any) {
      addDebug('❌ Error: ' + err.message);
      Alert.alert('Error', 'No se pudo autenticar: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.header}>
          <Text style={styles.logo}>🔐</Text>
          <Text style={styles.title}>SecureAuth</Text>
          <Text style={styles.subtitle}>
            Gestión segura de tu perfil{'\n'}con autenticación OAuth
          </Text>
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={{ fontSize: 20 }}>🔐</Text>
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </>
          )}
        </TouchableOpacity>

        {debug.length > 0 && (
          <View style={styles.debugBox}>
            <Text style={styles.debugText}>{debug}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
