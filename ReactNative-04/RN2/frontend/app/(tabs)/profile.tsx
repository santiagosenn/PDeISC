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
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const API_URL = 'http://localhost:3000';

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
  inputError: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
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
  errorText: {
    fontSize: 12,
    color: '#f44336',
    marginTop: -10,
    marginBottom: 10,
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
  helperText: {
    fontSize: 11,
    color: '#999',
    marginTop: -10,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  webMapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalButtons: {
    width: '100%',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  cameraModal: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: '100%',
    maxWidth: 640,
    aspectRatio: 4/3,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#4285F4',
  },
  cancelCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenCanvas: {
    display: 'none',
  },
});

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: '',
    latitude: null,
    longitude: null,
    documentType: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  });
  
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

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

  const validateName = (name) => {
    if (name.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (/\d/.test(name)) {
      return 'El nombre no puede contener números';
    }
    return '';
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    if (cleanPhone.length === 0) return '';
    
    if (!/^\d+$/.test(cleanPhone)) {
      return 'El teléfono solo puede contener números';
    }
    if (cleanPhone.length < 8) {
      return 'El teléfono debe tener al menos 8 dígitos';
    }
    if (cleanPhone.length > 15) {
      return 'El teléfono no puede tener más de 15 dígitos';
    }
    return '';
  };

  const handleNameChange = (text) => {
    setProfile({ ...profile, name: text });
    const error = validateName(text);
    setErrors({ ...errors, name: error });
  };

  const handlePhoneChange = (text) => {
    setProfile({ ...profile, phone: text });
    const error = validatePhone(text);
    setErrors({ ...errors, phone: error });
  };

  const openImagePicker = () => {
    setShowImageModal(true);
  };

  const takePhoto = async () => {
    try {
      setShowImageModal(false);
      setShowCameraModal(true);
      
      // Activar la cámara web
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      setCameraStream(stream);
      
      // Esperar a que el video esté listo
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      Alert.alert('Error', 'No se pudo acceder a la cámara. Verifica los permisos del navegador.');
      setShowCameraModal(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Configurar el canvas con el tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujar el frame actual del video en el canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir a blob
    canvas.toBlob((blob) => {
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      const uri = URL.createObjectURL(file);
      
      // Detener la cámara
      stopCamera();
      
      // Subir la foto
      uploadProfilePicture(uri, file);
    }, 'image/jpeg', 0.8);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const pickFromGallery = async () => {
    try {
      setShowImageModal(false);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        uploadProfilePicture(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const uploadProfilePicture = async (uri, file = null) => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      
      if (file) {
        // Si es un archivo de la cámara web
        formData.append('picture', file, 'profile.jpg');
      } else {
        // Si es de la galería
        formData.append('picture', {
          uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch(`${API_URL}/api/profile/picture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        Alert.alert('Éxito', 'Foto de perfil actualizada');
      } else {
        Alert.alert('Error', 'No se pudo subir la foto');
      }
    } catch (err) {
      console.error('Error al subir foto:', err);
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

      setSaving(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setProfile({
        ...profile,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      Alert.alert(
        'Ubicación obtenida',
        '✓ Tu ubicación se ha actualizado en el mapa'
      );
    } catch (err) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setSaving(false);
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
    const nameError = validateName(profile.name);
    const phoneError = validatePhone(profile.phone);

    if (nameError || phoneError) {
      setErrors({ name: nameError, phone: phoneError });
      Alert.alert('Error de validación', 'Por favor corrige los errores antes de guardar');
      return;
    }

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
      } else {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
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
    <>
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

            <TouchableOpacity 
              style={[styles.button, { marginTop: 15 }]} 
              onPress={openImagePicker} 
              disabled={saving}
            >
              <FontAwesome name="camera" size={14} color="#fff" />
              <Text style={styles.buttonText}>Cambiar Foto</Text>
            </TouchableOpacity>
          </View>

          {/* Información Personal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={profile.name}
              onChangeText={handleNameChange}
              placeholder="Tu nombre completo"
            />
            {errors.name ? <Text style={styles.errorText}>⚠️ {errors.name}</Text> : null}
            <Text style={styles.helperText}>Mínimo 2 caracteres, sin números</Text>

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={[styles.input, errors.phone ? styles.inputError : null]}
              value={profile.phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              placeholder="+54 9 XXX XXXXXXX"
            />
            {errors.phone ? <Text style={styles.errorText}>⚠️ {errors.phone}</Text> : null}
            <Text style={styles.helperText}>Entre 8 y 15 dígitos, solo números</Text>

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={profile.address}
              onChangeText={(text) => setProfile({ ...profile, address: text })}
              placeholder="Tu dirección completa"
              multiline
            />
          </View>

          {/* Ubicación con Mapa (Solo Web) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>

            <TouchableOpacity style={styles.button} onPress={getLocation} disabled={saving}>
              <FontAwesome name="map-marker" size={14} color="#fff" />
              <Text style={styles.buttonText}>Obtener Ubicación Actual</Text>
            </TouchableOpacity>

            {profile.latitude && profile.longitude && (
              <>
                <View style={styles.webMapContainer}>
                  <iframe
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    src={`https://maps.google.com/maps?q=${profile.latitude},${profile.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                  />
                </View>
                
                <View style={styles.locationInfo}>
                  <Text style={styles.locationText}>
                    📍 Latitud: {parseFloat(profile.latitude).toFixed(6)}{'\n'}
                    🗺️ Longitud: {parseFloat(profile.longitude).toFixed(6)}
                  </Text>
                </View>
              </>
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
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={updateProfile} 
            disabled={saving || errors.name || errors.phone}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>💾 Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para seleccionar cámara o galería */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar foto</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <FontAwesome name="camera" size={16} color="#fff" />
                <Text style={styles.buttonText}>Tomar Foto</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
                <FontAwesome name="image" size={16} color="#fff" />
                <Text style={styles.buttonText}>Elegir de Galería</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setShowImageModal(false)}
              >
                <FontAwesome name="times" size={16} color="#fff" />
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de cámara web */}
      <Modal
        visible={showCameraModal}
        transparent={false}
        animationType="slide"
        onRequestClose={stopCamera}
      >
        <View style={styles.cameraModal}>
          <View style={styles.cameraContainer}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={styles.video}
            />
            
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.cancelCameraButton}
                onPress={stopCamera}
              >
                <FontAwesome name="times" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={capturePhoto}
              >
                <FontAwesome name="camera" size={30} color="#4285F4" />
              </TouchableOpacity>
            </View>
          </View>
          
          <canvas ref={canvasRef} style={styles.hiddenCanvas} />
        </View>
      </Modal>
    </>
  );
}