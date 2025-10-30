import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';
import { recetasEvents } from './utils/events';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [receta, setReceta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    descripcion: '',
    tipo_corte: '',
    metodo_coccion: '',
    tiempo_preparacion: '',
    ingredientes: '',
    paso_a_paso: '',
  });

  useEffect(() => {
    cargarReceta();
  }, [id]);

  const cargarReceta = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/recetas/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setReceta(data.receta);
        setEditForm({
          nombre: data.receta.nombre || '',
          descripcion: data.receta.descripcion || '',
          tipo_corte: data.receta.tipo_corte || '',
          metodo_coccion: data.receta.metodo_coccion || '',
          tiempo_preparacion: data.receta.tiempo_preparacion?.toString() || '',
          ingredientes: data.receta.ingredientes || '',
          paso_a_paso: data.receta.paso_a_paso || '',
        });
      }
    } catch (e) {
      console.error('Error al cargar receta:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = () => {
    setDeleteModalVisible(true);
  };

  const confirmarEliminar = async () => {
    setDeleteModalVisible(false);

    try {
      const response = await fetch(`http://127.0.0.1:3000/recetas/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          usuario_id: user?.id,
          isAdmin: user?.isAdmin || false
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Emitir evento para actualizar Feed y Perfil
        recetasEvents.emit('recetaEliminada');
        
        console.log('✅ Receta eliminada correctamente');
        router.back();
      } else {
        console.error('Error al eliminar:', data.error);
        router.back();
      }
    } catch (e) {
      console.error('Error al eliminar:', e);
      router.back();
    }
  };

  const handleEditar = () => {
    setEditModalVisible(true);
  };

  const handleGuardarEdicion = async () => {
    if (!editForm.nombre.trim()) {
      console.warn('Nombre vacío');
      return;
    }
    if (!editForm.ingredientes.trim()) {
      console.warn('Ingredientes vacíos');
      return;
    }
    if (!editForm.paso_a_paso.trim()) {
      console.warn('Paso a paso vacío');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:3000/recetas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: user?.id,
          nombre: editForm.nombre,
          descripcion: editForm.descripcion,
          tipo_corte: editForm.tipo_corte,
          metodo_coccion: editForm.metodo_coccion,
          tiempo_preparacion: editForm.tiempo_preparacion ? parseInt(editForm.tiempo_preparacion) : null,
          ingredientes: editForm.ingredientes,
          paso_a_paso: editForm.paso_a_paso,
          foto_url: receta.foto_url || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEditModalVisible(false);
        
        // Emitir evento para actualizar Feed y Perfil
        recetasEvents.emit('recetaActualizada');
        
        console.log('✅ Receta actualizada correctamente');
        cargarReceta();
      } else {
        console.error('Error al actualizar:', data.error);
      }
    } catch (e) {
      console.error('Error al actualizar:', e);
    }
  };

  // Nueva función para navegar al perfil del usuario
  const handleNavigateToUserProfile = () => {
    if (receta && receta.usuario_id) {
      router.push(`/user-profile?userId=${receta.usuario_id}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C41E3A" />
      </View>
    );
  }

  if (!receta) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Receta no encontrada</Text>
      </View>
    );
  }

  const esPropia = user?.id === receta.usuario_id;

  return (
    <>
      <ScrollView style={styles.container}>
        {receta.foto_url ? (
          <Image source={{ uri: receta.foto_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="restaurant" size={80} color="#999" />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{receta.nombre}</Text>
            {/* Hacer el nombre del autor clickeable */}
            <TouchableOpacity onPress={handleNavigateToUserProfile}>
              <Text style={styles.author}>Por @{receta.usuario_nombre}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {receta.tipo_corte && (
              <View style={styles.tag}>
                <Ionicons name="cut" size={16} color="#C41E3A" />
                <Text style={styles.tagText}>{receta.tipo_corte}</Text>
              </View>
            )}
            {receta.metodo_coccion && (
              <View style={styles.tag}>
                <Ionicons name="flame" size={16} color="#C41E3A" />
                <Text style={styles.tagText}>{receta.metodo_coccion}</Text>
              </View>
            )}
            {receta.tiempo_preparacion && (
              <View style={styles.tag}>
                <Ionicons name="time" size={16} color="#C41E3A" />
                <Text style={styles.tagText}>{receta.tiempo_preparacion} min</Text>
              </View>
            )}
          </View>

          {receta.descripcion && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{receta.descripcion}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            <Text style={styles.text}>{receta.ingredientes}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preparación</Text>
            <Text style={styles.text}>{receta.paso_a_paso}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color="#C41E3A" />
              <Text style={styles.actionText}>Me gusta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={24} color="#C41E3A" />
              <Text style={styles.actionText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={24} color="#C41E3A" />
              <Text style={styles.actionText}>Compartir</Text>
            </TouchableOpacity>
          </View>

          {esPropia && (
            <View style={styles.ownerActions}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleEditar}
              >
                <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleEliminar}
              >
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={28} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Receta</Text>
            <TouchableOpacity onPress={handleGuardarEdicion}>
              <Text style={styles.saveButton}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={editForm.nombre}
                onChangeText={(text) => setEditForm({...editForm, nombre: text})}
                placeholder="Nombre de la receta"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.descripcion}
                onChangeText={(text) => setEditForm({...editForm, descripcion: text})}
                placeholder="Descripción breve"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo de Corte</Text>
              <TextInput
                style={styles.input}
                value={editForm.tipo_corte}
                onChangeText={(text) => setEditForm({...editForm, tipo_corte: text})}
                placeholder="Ej: Bife de chorizo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Método de Cocción</Text>
              <TextInput
                style={styles.input}
                value={editForm.metodo_coccion}
                onChangeText={(text) => setEditForm({...editForm, metodo_coccion: text})}
                placeholder="Ej: Parrilla"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tiempo de Preparación (minutos)</Text>
              <TextInput
                style={styles.input}
                value={editForm.tiempo_preparacion}
                onChangeText={(text) => setEditForm({...editForm, tiempo_preparacion: text})}
                placeholder="Ej: 45"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ingredientes *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.ingredientes}
                onChangeText={(text) => setEditForm({...editForm, ingredientes: text})}
                placeholder="Lista de ingredientes"
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Paso a Paso *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.paso_a_paso}
                onChangeText={(text) => setEditForm({...editForm, paso_a_paso: text})}
                placeholder="Instrucciones detalladas"
                multiline
                numberOfLines={8}
              />
            </View>
            <View style={styles.bottomSpace} />
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmIconContainer}>
              <Ionicons name="warning" size={50} color="#F44336" />
            </View>
            
            <Text style={styles.confirmTitle}>Eliminar receta</Text>
            <Text style={styles.confirmMessage}>
              ¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer.
            </Text>

            <View style={styles.confirmButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmDeleteButton}
                onPress={confirmarEliminar}
              >
                <Text style={styles.confirmDeleteButtonText}>Eliminar</Text>
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
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#C41E3A', // Cambio de color para indicar que es clickeable
    fontWeight: '600', // Hacer más prominente
    textDecorationLine: 'underline', // Subrayado para indicar que es un enlace
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#C41E3A',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#C41E3A',
    marginTop: 4,
    fontWeight: '600',
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C41E3A',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bottomSpace: {
    height: 40,
  },
  // Estilos del modal de confirmación
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
  confirmIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  confirmDeleteButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F44336',
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});