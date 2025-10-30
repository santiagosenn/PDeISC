import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Animal = 'vaca' | 'cerdo' | 'pollo';

interface FormFieldsProps {
  // Animal
  animalActual: Animal;
  setAnimalActual: (animal: Animal) => void;
  tipoCorte: string;
  setTipoCorte: (tipo: string) => void;
  
  // Método de cocción
  metodoCoccion: string;
  setMetodoCoccion: (metodo: string) => void;
  
  // Tiempo
  tiempoPreparacion: string;
  setTiempoPreparacion: (tiempo: string) => void;
}

export default function FormFields({
  animalActual,
  setAnimalActual,
  tipoCorte,
  setTipoCorte,
  metodoCoccion,
  setMetodoCoccion,
  tiempoPreparacion,
  setTiempoPreparacion
}: FormFieldsProps) {
  
  const cortesVaca = [
    'Bife de Chorizo', 'Lomo', 'Asado de Tira', 'Vacío', 'Entraña', 'Costilla'
  ];

  const cortesCerdo = [
    'Chuleta', 'Lomo', 'Panceta', 'Costillar'
  ];

  const cortesPollo = [
    'Pechuga', 'Muslo', 'Ala', 'Pollo Entero'
  ];

  const metodosCoccion = [
    { id: 'parrilla', nombre: 'Parrilla', icon: 'flame' },
    { id: 'horno', nombre: 'Horno', icon: 'restaurant' },
    { id: 'sarten', nombre: 'Sartén', icon: 'nutrition' },
    { id: 'ahumado', nombre: 'Ahumado', icon: 'cloud' },
  ];

  const tiemposPreparacion = [
    { id: 'rapido', nombre: 'Rápido (< 30 min)', valor: 15 },
    { id: 'medio', nombre: 'Medio (30-60 min)', valor: 45 },
    { id: 'largo', nombre: 'Largo (> 60 min)', valor: 90 },
  ];

  const cortesActuales = animalActual === 'vaca' ? cortesVaca : animalActual === 'cerdo' ? cortesCerdo : cortesPollo;

  return (
    <View style={styles.container}>
      {/* Selector de Animal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Animal</Text>
        <View style={styles.animalSelector}>
          <TouchableOpacity 
            style={[styles.animalButton, animalActual === 'vaca' && styles.animalButtonActive]}
            onPress={() => setAnimalActual('vaca')}
          >
            <Text style={[styles.animalText, animalActual === 'vaca' && styles.animalTextActive]}>
              🐄 Vaca
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.animalButton, animalActual === 'cerdo' && styles.animalButtonActive]}
            onPress={() => setAnimalActual('cerdo')}
          >
            <Text style={[styles.animalText, animalActual === 'cerdo' && styles.animalTextActive]}>
              🐷 Cerdo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.animalButton, animalActual === 'pollo' && styles.animalButtonActive]}
            onPress={() => setAnimalActual('pollo')}
          >
            <Text style={[styles.animalText, animalActual === 'pollo' && styles.animalTextActive]}>
              🐔 Pollo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selector de Corte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Corte</Text>
        <View style={styles.cortesGrid}>
          {cortesActuales.map((corte) => (
            <TouchableOpacity
              key={corte}
              style={[
                styles.corteButton,
                tipoCorte === corte && styles.corteButtonActive
              ]}
              onPress={() => setTipoCorte(tipoCorte === corte ? '' : corte)}
            >
              <Text style={[
                styles.corteText,
                tipoCorte === corte && styles.corteTextActive
              ]}>
                {corte}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selector de Método de Cocción */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Método de Cocción</Text>
        <View style={styles.metodosGrid}>
          {metodosCoccion.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                styles.metodoButton,
                metodoCoccion === metodo.nombre && styles.metodoButtonActive
              ]}
              onPress={() => setMetodoCoccion(metodoCoccion === metodo.nombre ? '' : metodo.nombre)}
            >
              <Ionicons 
                name={metodo.icon as any} 
                size={24} 
                color={metodoCoccion === metodo.nombre ? '#FFFFFF' : '#C41E3A'} 
              />
              <Text style={[
                styles.metodoText,
                metodoCoccion === metodo.nombre && styles.metodoTextActive
              ]}>
                {metodo.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selector de Tiempo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tiempo de Preparación</Text>
        <View style={styles.tiemposList}>
          {tiemposPreparacion.map((tiempo) => (
            <TouchableOpacity
              key={tiempo.id}
              style={[
                styles.tiempoButton,
                tiempoPreparacion === tiempo.valor.toString() && styles.tiempoButtonActive
              ]}
              onPress={() => setTiempoPreparacion(
                tiempoPreparacion === tiempo.valor.toString() ? '' : tiempo.valor.toString()
              )}
            >
              <Ionicons 
                name="time-outline" 
                size={20} 
                color={tiempoPreparacion === tiempo.valor.toString() ? '#FFFFFF' : '#C41E3A'} 
              />
              <Text style={[
                styles.tiempoText,
                tiempoPreparacion === tiempo.valor.toString() && styles.tiempoTextActive
              ]}>
                {tiempo.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  animalSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  animalButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  animalButtonActive: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  animalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  animalTextActive: {
    color: '#FFFFFF',
  },
  cortesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  corteButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  corteButtonActive: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  corteText: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  corteTextActive: {
    color: '#FFFFFF',
  },
  metodosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metodoButton: {
    width: '47%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  metodoButtonActive: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  metodoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  metodoTextActive: {
    color: '#FFFFFF',
  },
  tiemposList: {
    gap: 8,
  },
  tiempoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tiempoButtonActive: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  tiempoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  tiempoTextActive: {
    color: '#FFFFFF',
  },
});