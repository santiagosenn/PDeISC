// app/(tabs)/settings.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://localhost:3000'; // Tu IP correcta

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  dangerText: {
    fontSize: 15,
    color: '#f44336',
    fontWeight: '500',
    flex: 1,
  },
  arrowIcon: {
    color: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default function SettingsScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              navigation.reset({
                index: 0,
                routes: [{ name: 'index' }],
              });
            } catch (err) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción no se puede deshacer. ¿Deseas continuar?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: () => {
            Alert.alert('Cuenta Eliminada', 'Tu cuenta ha sido eliminada permanentemente');
          },
          style: 'destructive',
        },
      ]
    );
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
        {/* Tarjeta de Usuario */}
        <View style={styles.userCard}>
          {user.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.userImage} />
          ) : (
            <View style={[styles.userImage, { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }]}>
              <FontAwesome name="user" size={24} color="#999" />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ✓ Autenticado con Google
          </Text>
        </View>

        {/* Sección Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Notificaciones Push</Text>
              <Text style={styles.settingDescription}>Recibe actualizaciones importantes</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81c784' }}
              thumbColor={notifications ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Recordatorios</Text>
              <Text style={styles.settingDescription}>Recordatorios de tareas pendientes</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#767577', true: '#81c784' }}
              thumbColor="#4CAF50"
            />
          </View>
        </View>

        {/* Sección Apariencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apariencia</Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Modo Oscuro</Text>
              <Text style={styles.settingDescription}>Activar modo oscuro</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#81c784' }}
              thumbColor={darkMode ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Sección Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonIcon}>
              <FontAwesome name="lock" size={16} color="#4285F4" />
            </View>
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
            <FontAwesome name="chevron-right" size={16} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonIcon}>
              <FontAwesome name="shield" size={16} color="#4285F4" />
            </View>
            <Text style={styles.buttonText}>Privacidad</Text>
            <FontAwesome name="chevron-right" size={16} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonIcon}>
              <FontAwesome name="link" size={16} color="#4285F4" />
            </View>
            <Text style={styles.buttonText}>Cuentas Conectadas</Text>
            <FontAwesome name="chevron-right" size={16} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* Sección Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonIcon}>
              <FontAwesome name="file-text" size={16} color="#4285F4" />
            </View>
            <Text style={styles.buttonText}>Términos y Condiciones</Text>
            <FontAwesome name="chevron-right" size={16} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonIcon}>
              <FontAwesome name="eye" size={16} color="#4285F4" />
            </View>
            <Text style={styles.buttonText}>Política de Privacidad</Text>
            <FontAwesome name="chevron-right" size={16} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonIcon}>
              <FontAwesome name="info-circle" size={16} color="#4285F4" />
            </View>
            <Text style={styles.buttonText}>Sobre la App</Text>
            <FontAwesome name="chevron-right" size={16} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* Sección Peligrosa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sesión</Text>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <View style={styles.buttonIcon}>
              <FontAwesome name="sign-out" size={16} color="#FF9800" />
            </View>
            <Text style={[styles.buttonText, { color: '#FF9800' }]}>Cerrar Sesión</Text>
            <FontAwesome name="chevron-right" size={16} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* Sección Eliminar Cuenta */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
            <View style={styles.buttonIcon}>
              <FontAwesome name="trash" size={16} color="#f44336" />
            </View>
            <Text style={styles.dangerText}>Eliminar Cuenta Permanentemente</Text>
            <FontAwesome name="chevron-right" size={16} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Versión 1.0.0</Text>
        <Text style={styles.versionText}>© 2024 - Todos los derechos reservados</Text>
      </View>
    </ScrollView>
  );
}