import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function UserProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  const esPerfilPropio = user?.id === parseInt(userId as string);

  useEffect(() => {
    if (userId) {
      cargarPerfilYRecetas();
    }
  }, [userId]);

  const cargarPerfilYRecetas = async () => {
    try {
      // Cargar información del usuario
      const userResponse = await fetch(`http://127.0.0.1:3000/usuarios/${userId}`);
      const userData = await userResponse.json();
      
      if (userData.success) {
        setProfileUser(userData.usuario);
      }

      // Cargar recetas del usuario
      const recetasResponse = await fetch(`http://127.0.0.1:3000/recetas/usuario/${userId}`);
      const recetasData = await recetasResponse.json();
      
      if (recetasData.success) {
        setRecetas(recetasData.recetas);
      }
    } catch (e) {
      console.error('Error al cargar perfil:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVolverAMiPerfil = () => {
    router.push('/(tabs)/profile');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C41E3A" />
      </View>
    );
  }

  if (!profileUser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuario no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header con botón de regreso si no es perfil propio */}
        {!esPerfilPropio && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        )}

        {/* Header del perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#666" />
            </View>
          </View>
          
          <Text style={styles.username}>@{profileUser.nombre}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{recetas.length}</Text>
              <Text style={styles.statLabel}>Recetas</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Siguiendo</Text>
            </View>
          </View>

          {!esPerfilPropio && (
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Seguir</Text>
            </TouchableOpacity>
          )}

          {esPerfilPropio && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleVolverAMiPerfil}
            >
              <Text style={styles.editButtonText}>Ver Mi Perfil Completo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recetas del usuario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recetas de {profileUser.nombre}</Text>
          
          {recetas.length > 0 ? (
            <View style={styles.recetasGrid}>
              {recetas.map((receta: any) => (
                <TouchableOpacity 
                  key={receta.id} 
                  style={styles.recetaCard}
                  onPress={() => router.push(`/recipe-detail?id=${receta.id}`)}
                >
                  {receta.foto_url ? (
                    <Image source={{ uri: receta.foto_url }} style={styles.recetaImage} />
                  ) : (
                    <View style={styles.recetaImagePlaceholder}>
                      <Ionicons name="restaurant" size={32} color="#999" />
                    </View>
                  )}
                  <Text style={styles.recetaNombre} numberOfLines={2}>
                    {receta.nombre}
                  </Text>
                  <Text style={styles.recetaInfo}>
                    {receta.tipo_corte || 'Sin categoría'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>
                {esPerfilPropio 
                  ? 'Aún no has publicado recetas' 
                  : `${profileUser.nombre} aún no ha publicado recetas`
                }
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  followButton: {
    backgroundColor: '#C41E3A',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  recetasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recetaCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recetaImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0E0E0',
  },
  recetaImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recetaNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    padding: 8,
    paddingBottom: 4,
  },
  recetaInfo: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});