import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CookProps {
  metodoSeleccionado: string | null;
  setMetodoSeleccionado: (metodo: string | null) => void;
}

export default function CookComponent({
  metodoSeleccionado,
  setMetodoSeleccionado
}: CookProps) {
  
  const metodosCoccion = [
    { id: 'parrilla', nombre: 'Parrilla', icon: 'flame' },
    { id: 'horno', nombre: 'Horno', icon: 'restaurant' },
    { id: 'sarten', nombre: 'Sartén', icon: 'nutrition' },
    { id: 'ahumado', nombre: 'Ahumado', icon: 'cloud' },
  ];

  return (
    <View style={styles.filtroContainer}>
      <Text style={styles.filtroTitle}>Método de Cocción</Text>
      <View style={styles.metodosGrid}>
        {metodosCoccion.map((metodo) => (
          <TouchableOpacity
            key={metodo.id}
            style={[
              styles.metodoCard,
              metodoSeleccionado === metodo.id && styles.metodoCardActive
            ]}
            onPress={() => setMetodoSeleccionado(metodoSeleccionado === metodo.id ? null : metodo.id)}
          >
            <Ionicons 
              name={metodo.icon as any} 
              size={32} 
              color={metodoSeleccionado === metodo.id ? '#FFFFFF' : '#C41E3A'} 
            />
            <Text style={[
              styles.metodoText,
              metodoSeleccionado === metodo.id && styles.metodoTextActive
            ]}>
              {metodo.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtroContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filtroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  metodosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metodoCard: {
    width: '47%',
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  metodoCardActive: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  metodoText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  metodoTextActive: {
    color: '#FFFFFF',
  },
});