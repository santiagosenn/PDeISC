import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimeProps {
  tiempoSeleccionado: string | null;
  setTiempoSeleccionado: (tiempo: string | null) => void;
}

export default function TimeComponent({
  tiempoSeleccionado,
  setTiempoSeleccionado
}: TimeProps) {
  
  const tiemposPreparacion = [
    { id: 'rapido', nombre: 'Rápido (< 30 min)', valor: 30 },
    { id: 'medio', nombre: 'Medio (30-60 min)', valor: 60 },
    { id: 'largo', nombre: 'Largo (> 60 min)', valor: 120 },
  ];

  return (
    <View style={styles.filtroContainer}>
      <Text style={styles.filtroTitle}>Tiempo de Preparación</Text>
      <View style={styles.tiemposList}>
        {tiemposPreparacion.map((tiempo) => (
          <TouchableOpacity
            key={tiempo.id}
            style={[
              styles.tiempoItem,
              tiempoSeleccionado === tiempo.id && styles.tiempoItemActive
            ]}
            onPress={() => setTiempoSeleccionado(tiempoSeleccionado === tiempo.id ? null : tiempo.id)}
          >
            <Ionicons 
              name="time-outline" 
              size={24} 
              color={tiempoSeleccionado === tiempo.id ? '#FFFFFF' : '#C41E3A'} 
            />
            <Text style={[
              styles.tiempoText,
              tiempoSeleccionado === tiempo.id && styles.tiempoTextActive
            ]}>
              {tiempo.nombre}
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
  tiemposList: {
    gap: 12,
  },
  tiempoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tiempoItemActive: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  tiempoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  tiempoTextActive: {
    color: '#FFFFFF',
  },
});