import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { recetasEvents } from '../utils/events';

export default function HomeScreen() {
  const router = useRouter();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarRecetas();
    
    // Escuchar eventos de cambios en recetas
    const handleRecetaCreada = () => {
      cargarRecetas();
    };

    const handleRecetaActualizada = () => {
      cargarRecetas();
    };

    const handleRecetaEliminada = () => {
      cargarRecetas();
    };
    
    recetasEvents.on('recetaCreada', handleRecetaCreada);
    recetasEvents.on('recetaActualizada', handleRecetaActualizada);
    recetasEvents.on('recetaEliminada', handleRecetaEliminada);
    
    // Limpiar listeners al desmontar
    return () => {
      recetasEvents.off('recetaCreada', handleRecetaCreada);
      recetasEvents.off('recetaActualizada', handleRecetaActualizada);
      recetasEvents.off('recetaEliminada', handleRecetaEliminada);
    };
  }, []);

  const cargarRecetas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/recetas');
      const data = await response.json();
      
      if (data.success) {
        setRecetas(data.recetas);
      }
    } catch (e) {
      console.error('Error al cargar recetas:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarRecetas();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C41E3A" />
        <Text style={styles.loadingText}>Cargando recetas...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#C41E3A']} />
      }
    >
      <View style={styles.content}>
        {recetas.length > 0 ? (
          recetas.map((receta: any) => (
            <TouchableOpacity 
              key={receta.id} 
              style={styles.card}
              onPress={() => router.push(`/recipe-detail?id=${receta.id}`)}
            >
              {receta.foto_url ? (
                <Image 
                  source={{ uri: receta.foto_url }} 
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="restaurant" size={64} color="#999" />
                  <Text style={styles.placeholderText}>Sin foto</Text>
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.title}>{receta.nombre}</Text>
                
                {receta.tipo_corte && (
                  <View style={styles.tagContainer}>
                    <View style={styles.tag}>
                      <Ionicons name="cut" size={14} color="#C41E3A" />
                      <Text style={styles.tagText}>{receta.tipo_corte}</Text>
                    </View>
                  </View>
                )}
                
                {receta.descripcion && (
                  <Text style={styles.description} numberOfLines={2}>
                    {receta.descripcion}
                  </Text>
                )}
                
                <Text style={styles.username}>Por @{receta.usuario_nombre}</Text>
                
                <View style={styles.stats}>
                  <View style={styles.stat}>
                    <Ionicons name="heart-outline" size={20} color="#666" />
                    <Text style={styles.statText}>0</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                    <Text style={styles.statText}>0</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="bookmark-outline" size={20} color="#666" />
                    <Text style={styles.statText}>0</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyMessage}>
            <Ionicons name="restaurant-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No hay recetas aún</Text>
            <Text style={styles.emptySubtext}>¡Sé el primero en crear una!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#C41E3A',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  username: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  emptyMessage: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});