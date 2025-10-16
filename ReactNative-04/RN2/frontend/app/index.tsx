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

const API_URL = 'http://localhost:3000'; // Tu IP correcta // CAMBIAR A TU IP LOCAL

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
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
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  featureList: {
    marginTop: 40,
    width: '100%',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  debugBox: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'Courier New',
  },
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState('');
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '730371176837-c10m8pjdted45pa39ir8h006pv4tgplr.apps.googleusercontent.com', // CAMBIAR AQUÍ
    redirectUrl: 'http://localhost:8081', // Expo usa este puerto por defecto
  });
  
  const router = useRouter();

  useEffect(() => {
    checkExistingSession();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      addDebug('✓ Respuesta de Google recibida');
      
      const token = response.authentication?.idToken || response.authentication?.accessToken;
      if (token) {
        handleGoogleAuth(token);
      } else {
        addDebug('❌ No se recibió token');
        Alert.alert('Error', 'No se recibió token de Google');
        setLoading(false);
      }
    } else if (response?.type === 'error') {
      addDebug('❌ Error de Google: ' + (response.error?.message || 'desconocido'));
      Alert.alert('Error', 'Error al autenticarse con Google');
      setLoading(false);
    }
  }, [response]);

  const addDebug = (msg) => {
    setDebug((prev) => prev + '\n' + msg);
  };

  const checkExistingSession = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        addDebug('✓ Sesión encontrada, redirigiendo...');
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      addDebug('ℹ️ No hay sesión guardada');
    }
  };

  const handleGoogleAuth = async (token) => {
    try {
      setLoading(true);
      addDebug('📤 Enviando token al backend...');
      addDebug('🔗 URL: ' + API_URL + '/api/auth/google');

      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }),
      });

      addDebug('📦 Respuesta: ' + response.status);

      const data = await response.json();

      if (!response.ok) {
        addDebug('❌ ' + data.error);
        throw new Error(data.error || 'Error en autenticación');
      }

      addDebug('✓ Autenticación exitosa');
      addDebug('💾 Guardando token...');
      
      await AsyncStorage.setItem('authToken', data.token);
      
      addDebug('✓ Token guardado');
      addDebug('🔄 Redirigiendo...');
      
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1000);
    } catch (err) {
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
          onPress={() => {
            addDebug('🔵 Iniciando Google Auth...');
            promptAsync();
          }}
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

        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>¿Por qué usar SecureAuth?</Text>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Autenticación segura con Google OAuth 2.0</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>👤</Text>
            <Text style={styles.featureText}>Perfil completo personalizable</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Foto de perfil y ubicación GPS</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📄</Text>
            <Text style={styles.featureText}>Escaneo y almacenamiento de documentos</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Acceso rápido desde cualquier dispositivo</Text>
          </View>
        </View>

        {/* Debug Box */}
        {debug.length > 0 && (
          <View style={styles.debugBox}>
            <Text style={styles.debugText}>{debug}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Al continuar, aceptas nuestros Términos y Condiciones{'\n'}y Política de Privacidad
        </Text>
      </View>
    </SafeAreaView>
  );
}