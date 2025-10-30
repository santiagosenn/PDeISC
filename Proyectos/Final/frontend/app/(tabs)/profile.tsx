import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { recetasEvents } from '../utils/events';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [recetasPendientes, setRecetasPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id !== undefined) {
      cargarRecetas();
      if (user?.isAdmin) {
        cargarRecetasPendientes();
      }
    }

    const handleRecetaChange = () => {
      if (user?.id !== undefined) {
        cargarRecetas();
        if (user?.isAdmin) {
          cargarRecetasPendientes();
        }
      }
    };

    recetasEvents.on('recetaCreada', handleRecetaChange);
    recetasEvents.on('recetaActualizada', handleRecetaChange);
    recetasEvents.on('recetaEliminada', handleRecetaChange);

    return () => {
      recetasEvents.off('recetaCreada', handleRecetaChange);
      recetasEvents.off('recetaActualizada', handleRecetaChange);
      recetasEvents.off('recetaEliminada', handleRecetaChange);
    };
  }, [user]);

  const cargarRecetas = async () => {
    try {
      let url = `http://127.0.0.1:3000/recetas/usuario/${user?.id}`;

      if (user?.isAdmin) {
        url = `http://127.0.0.1:3000/admin/recetas?usuario_id=${user?.id}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setRecetas(data.recetas);
      }
    } catch (e) {
      console.error('Error al cargar recetas:', e);
    } finally {
      setLoading(false);
    }
  };

  const cargarRecetasPendientes = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/admin/recetas?usuario_id=${user?.id}`);
      const data = await response.json();

      if (data.success) {
        const pendientes = data.recetas.filter((r: any) => r.aprobada === 0);
        setRecetasPendientes(pendientes);
      }
    } catch (e) {
      console.error('Error al cargar recetas pendientes:', e);
    }
  };

  const handleAprobar = async (recetaId: number, aprobar: boolean) => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/admin/recetas/${recetaId}/aprobar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: user?.id, aprobar }),
      });

      const data = await response.json();

      if (data.success) {
        cargarRecetas();
        cargarRecetasPendientes();
      }
    } catch (e) {
      console.error('Error al aprobar/rechazar receta:', e);
    }
  };

  const handleEliminar = async (recetaId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/admin/recetas/${recetaId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: user?.id }),
      });

      const data = await response.json();

      if (data.success) {
        cargarRecetas();
        cargarRecetasPendientes();
      }
    } catch (e) {
      console.error('Error al eliminar receta:', e);
    }
  };

  const handleLogout = () => setLogoutModalVisible(true);

  const confirmarLogout = () => {
    setLogoutModalVisible(false);
    setUser(null);
    router.replace('/');
  };

  const usuario = {
    nombre: user?.nombre || 'usuario',
    recetas: recetas.length,
    pendientes: recetasPendientes.length,
    seguidores: 0,
    siguiendo: 0,
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={50} color="#666" />
              </View>
            </View>
            <Text style={styles.username}>@{usuario.nombre}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{usuario.recetas}</Text>
                <Text style={styles.statLabel}>Recetas</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{usuario.seguidores}</Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{usuario.siguiendo}</Text>
                <Text style={styles.statLabel}>Siguiendo</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* BOTONES DE GUARDADOS, ME GUSTA Y CONFIGURACIÓN */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} activeOpacity={0.7}>
              <Ionicons name="bookmark-outline" size={24} color="#1a1a1a" />
              <Text style={styles.optionText}>Guardados</Text>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} activeOpacity={0.7}>
              <Ionicons name="heart-outline" size={24} color="#1a1a1a" />
              <Text style={styles.optionText}>Me gusta</Text>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={24} color="#1a1a1a" />
              <Text style={styles.optionText}>Configuración</Text>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </TouchableOpacity>
          </View>

          {/* 🔹 PANEL DE ADMINISTRADOR */}
          {user?.isAdmin && recetasPendientes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recetas Pendientes de Aprobación</Text>
              {recetasPendientes.map((receta: any) => (
                <View key={receta.id} style={styles.pendienteCard}>
                  <View style={styles.pendienteInfo}>
                    {receta.foto_url ? (
                      <Image source={{ uri: receta.foto_url }} style={styles.pendienteImage} />
                    ) : (
                      <View style={styles.pendienteImagePlaceholder}>
                        <Ionicons name="restaurant-outline" size={30} color="#999" />
                      </View>
                    )}
                    <View style={styles.pendienteTexto}>
                      <Text style={styles.pendienteNombre}>{receta.nombre}</Text>
                      <Text style={styles.pendienteAutor}>por @{receta.usuario_nombre}</Text>
                    </View>
                  </View>

                  <View style={styles.pendienteAcciones}>
                    <TouchableOpacity onPress={() => handleAprobar(receta.id, true)}>
                      <Ionicons name="checkmark-circle" size={28} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEliminar(receta.id)}>
                      <Ionicons name="trash" size={28} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* MIS RECETAS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Recetas</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/create')}>
                <Ionicons name="add-circle" size={28} color="#C41E3A" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C41E3A" />
              </View>
            ) : recetas.length > 0 ? (
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
                <Text style={styles.emptyText}>Aún no has publicado recetas</Text>
              </View>
            )}
          </View>

          {/* CERRAR SESIÓN */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#C41E3A" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        visible={logoutModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Ionicons name="log-out" size={50} color="#C41E3A" />
            <Text style={styles.confirmTitle}>Cerrar sesión</Text>
            <Text style={styles.confirmMessage}>¿Seguro que querés salir?</Text>

            <View style={styles.confirmButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmLogoutButton} onPress={confirmarLogout}>
                <Text style={styles.confirmLogoutButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
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
  pendienteCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#FFD54F',
  },
  pendienteInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pendienteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  pendienteImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendienteTexto: {
    flex: 1,
  },
  pendienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  pendienteAutor: {
    fontSize: 13,
    color: '#666',
  },
  pendienteAcciones: {
    flexDirection: 'row',
    gap: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C41E3A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C41E3A',
    marginVertical: 8,
  },
  confirmMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  confirmLogoutButton: {
    flex: 1,
    backgroundColor: '#C41E3A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmLogoutButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
});
