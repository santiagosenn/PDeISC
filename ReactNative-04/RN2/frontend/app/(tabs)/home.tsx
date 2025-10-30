// app/(tabs)/home.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://localhost:3000';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4285F4',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#2e7d32',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 12,
  },
  backButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationBox: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  locationText: {
    fontSize: 13,
    color: '#1976d2',
    lineHeight: 20,
  },
});

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        await AsyncStorage.removeItem('authToken');
      }
    } catch (err) {
      console.error('Error al obtener datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      router.replace('/');
    } catch (err) {
      console.error('Error al limpiar sesión:', err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={{ fontSize: 18, color: '#333', fontWeight: 'bold', marginBottom: 10 }}>
          😕 No hay sesión activa
        </Text>
        <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 20 }}>
          Necesitas iniciar sesión para ver tu perfil
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={clearSession}>
          <Text style={styles.backButtonText}>🔐 Volver al Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        {/* Tarjeta de Bienvenida */}
        <View style={styles.welcomeCard}>
          <View style={styles.statusBadge}>
            <Text style={{ fontSize: 14 }}>✓</Text>
            <Text style={styles.statusText}>Sesión activa</Text>
          </View>

          <Text style={styles.welcomeText}>¡Hola, {user.name}! 👋</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          {user.profilePicture && (
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
            </View>
          )}

          <Text style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
            Proveedor: <Text style={{ fontWeight: '600' }}>Google</Text>
          </Text>
        </View>

        {/* Información de Perfil */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>📋 Información de Perfil</Text>

          {/* Nombre */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👤 NOMBRE COMPLETO</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
          </View>

          {/* Teléfono */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📱 TELÉFONO</Text>
            {user.profile?.phone ? (
              <Text style={styles.infoValue}>{user.profile.phone}</Text>
            ) : (
              <Text style={styles.emptyText}>No configurado</Text>
            )}
          </View>

          {/* Dirección */}
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>📍 DIRECCIÓN</Text>
            {user.profile?.address ? (
              <Text style={styles.infoValue}>{user.profile.address}</Text>
            ) : (
              <Text style={styles.emptyText}>No configurada</Text>
            )}
          </View>
        </View>

        {/* Ubicación GPS */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>🗺️ Ubicación GPS</Text>

          {user.profile?.latitude && user.profile?.longitude ? (
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>
                📍 Latitud: {parseFloat(user.profile.latitude).toFixed(6)}{'\n'}
                🧭 Longitud: {parseFloat(user.profile.longitude).toFixed(6)}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>
              📍 Ubicación no configurada. Ve a la pestaña "Perfil" para obtener tu ubicación.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}