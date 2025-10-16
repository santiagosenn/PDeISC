// app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const API_URL = 'http://localhost:3000'; // Tu IP correcta

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4285F4',
    marginBottom: 15,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 10,
  },
  locationInfo: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  locationText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
});

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: '',
    latitude: null,
    longitude: null,
    documentType: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setProfile({
          name: data.name,
          phone: data.profile?.phone || '',
          address: data.profile?.address || '',
          latitude: data.profile?.latitude,
          longitude: data.profile?.longitude,
          documentType: data.profile?.documentType || '',
        });
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.cancelled) {
        uploadProfilePicture(result.uri);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const uploadProfilePicture = async (uri) => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('picture', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`${API_URL}/api/profile/picture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        Alert.alert('Éxito', 'Foto de perfil actualizada');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo subir la foto');
    } finally {
      setSaving(false);
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso de ubicación');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setProfile({
        ...profile,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      Alert.alert(
        'Ubicación obtenida',
        `Lat: ${location.coords.latitude.toFixed(6)}\nLon: ${location.coords.longitude.toFixed(6)}`
      );
    } catch (err) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
      });

      if (result.type === 'success') {
        uploadDocument(result.uri);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo seleccionar el documento');
    }
  };

  const uploadDocument = async (uri) => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('document', {
        uri,
        name: 'document.pdf',
        type: 'application/pdf',
      });

      const response = await fetch(`${API_URL}/api/profile/document`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        Alert.alert('Éxito', 'Documento cargado correctamente');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo subir el documento');
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
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
        <Text>No hay sesión activa</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header de Perfil */}
        <View style={styles.profileHeader}>
          {user.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <FontAwesome name="user" size={50} color="#999" />
            </View>
          )}

          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>

          <TouchableOpacity style={[styles.button, { marginTop: 15 }]} onPress={pickImage} disabled={saving}>
            <FontAwesome name="camera" size={14} color="#fff" />
            <Text style={styles.buttonText}>Cambiar Foto</Text>
          </TouchableOpacity>
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Tu nombre completo"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={profile.phone}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
            keyboardType="phone-pad"
            placeholder="+54 9 XXX XXXXXXX"
          />

          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={profile.address}
            onChangeText={(text) => setProfile({ ...profile, address: text })}
            placeholder="Tu dirección completa"
            multiline
          />
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>

          <TouchableOpacity style={styles.button} onPress={getLocation} disabled={saving}>
            <FontAwesome name="map-marker" size={14} color="#fff" />
            <Text style={styles.buttonText}>Obtener Ubicación Actual</Text>
          </TouchableOpacity>

          {profile.latitude && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                📍 Latitud: {profile.latitude.toFixed(6)}{'\n'}
                🗺️ Longitud: {profile.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        {/* Documento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Documento</Text>

          <Text style={styles.label}>Tipo de Documento</Text>
          <TextInput
            style={styles.input}
            value={profile.documentType}
            onChangeText={(text) => setProfile({ ...profile, documentType: text })}
            placeholder="DNI, Pasaporte, Cédula, etc"
          />

          <TouchableOpacity style={styles.button} onPress={pickDocument} disabled={saving}>
            <FontAwesome name="file" size={14} color="#fff" />
            <Text style={styles.buttonText}>Escanear Documento</Text>
          </TouchableOpacity>

          {user.profile?.documentScan && <Text style={styles.infoText}>✓ Documento cargado</Text>}
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={updateProfile} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>💾 Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}