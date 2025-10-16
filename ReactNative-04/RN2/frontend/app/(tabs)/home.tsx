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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000'; // Tu IP correcta

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
    fontSize: 24,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  statusText: {
    color: '#2e7d32',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 12,
  },
});

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
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

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={{ fontSize: 16, color: '#999' }}>No hay sesión activa</Text>
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

          <Text style={styles.welcomeText}>¡Hola!</Text>
          <Text style={styles.userName}>{user.name}</Text>

          {user.profilePicture && (
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
            </View>
          )}

          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>
            Proveedor: <Text style={{ fontWeight: '600' }}>Google</Text>
          </Text>
        </View>

        {/* Sección de Información */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información de Perfil</Text>

          {user.profile?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📱 Teléfono</Text>
              <Text style={styles.infoValue}>{user.profile.phone}</Text>
            </View>
          )}

          {user.profile?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Dirección</Text>
              <Text style={styles.infoValue}>{user.profile.address.substring(0, 20)}...</Text>
            </View>
          )}

          {user.profile?.latitude && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🗺️ Ubicación GPS</Text>
              <Text style={styles.infoValue}>
                {user.profile.latitude.toFixed(4)}, {user.profile.longitude.toFixed(4)}
              </Text>
            </View>
          )}

          {user.profile?.documentType && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📄 Documento</Text>
              <Text style={styles.infoValue}>{user.profile.documentType}</Text>
            </View>
          )}

          {user.profile?.documentScan && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📋 Escaneo</Text>
              <Text style={{ color: '#4CAF50', fontWeight: '600' }}>✓ Cargado</Text>
            </View>
          )}
        </View>

        {/* Estado del Perfil */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Estado del Perfil</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📧 Email</Text>
            <Text style={{ color: '#4CAF50', fontWeight: '600' }}>✓ Verificado</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👤 Foto de Perfil</Text>
            <Text
              style={{
                color: user.profilePicture ? '#4CAF50' : '#FF9800',
                fontWeight: '600',
              }}
            >
              {user.profilePicture ? '✓ Agregada' : '⚠ No agregada'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Ubicación</Text>
            <Text
              style={{
                color: user.profile?.latitude ? '#4CAF50' : '#FF9800',
                fontWeight: '600',
              }}
            >
              {user.profile?.latitude ? '✓ Agregada' : '⚠ No agregada'}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>📄 Documento</Text>
            <Text
              style={{
                color: user.profile?.documentScan ? '#4CAF50' : '#FF9800',
                fontWeight: '600',
              }}
            >
              {user.profile?.documentScan ? '✓ Cargado' : '⚠ No cargado'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}