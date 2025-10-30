import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path, Polygon, Circle, Ellipse } from 'react-native-svg';

type Animal = 'vaca' | 'cerdo' | 'pollo';

interface AnimalProps {
  animalActual: Animal;
  setAnimalActual: (animal: Animal) => void;
  corteSeleccionado: string | null;
  setCorteSeleccionado: (corte: string | null) => void;
  mostrarMenuAnimal: boolean;
  setMostrarMenuAnimal: (mostrar: boolean) => void;
}

export default function AnimalComponent({
  animalActual,
  setAnimalActual,
  corteSeleccionado,
  setCorteSeleccionado,
  mostrarMenuAnimal,
  setMostrarMenuAnimal
}: AnimalProps) {
  
  const cortesVaca = [
    { id: 'cuadril', nombre: 'Cuadril', zona: '80,100 115,100 115,135 80,135' },
    { id: 'lomo', nombre: 'Lomo', zona: '115,95 155,95 155,125 115,125' },
    { id: 'bife-chorizo', nombre: 'Bife de Chorizo', zona: '155,90 195,90 195,125 155,125' },
    { id: 'paleta', nombre: 'Paleta', zona: '210,95 245,95 245,135 210,135' },
    { id: 'vacio', nombre: 'Vacío', zona: '115,135 155,135 155,165 115,165' },
    { id: 'asado', nombre: 'Asado de Tira', zona: '155,135 195,135 195,165 155,165' },
    { id: 'entraña', nombre: 'Entraña', zona: '125,125 165,125 165,145 125,145' },
    { id: 'costilla', nombre: 'Costilla', zona: '155,70 195,70 195,88 155,88' },
  ];

  const cortesCerdo = [
    { id: 'pierna', nombre: 'Pierna', zona: '80,105 120,105 120,145 80,145' },
    { id: 'lomo-cerdo', nombre: 'Lomo', zona: '120,95 165,95 165,120 120,120' },
    { id: 'chuleta', nombre: 'Chuleta', zona: '165,90 205,90 205,125 165,125' },
    { id: 'paleta-cerdo', nombre: 'Paleta', zona: '215,95 250,95 250,130 215,130' },
    { id: 'panceta', nombre: 'Panceta', zona: '120,125 205,125 205,155 120,155' },
    { id: 'costillar', nombre: 'Costillar', zona: '140,70 185,70 185,88 140,88' },
  ];

  const cortesPollo = [
    { id: 'ala', nombre: 'Ala', zona: '185,95 215,95 215,125 185,125' },
    { id: 'pechuga', nombre: 'Pechuga', zona: '135,105 175,105 175,145 135,145' },
    { id: 'encuentro', nombre: 'Encuentro', zona: '95,95 125,95 125,125 95,125' },
    { id: 'muslo', nombre: 'Muslo', zona: '115,150 155,150 155,185 115,185' },
    { id: 'contramuslo', nombre: 'Contramuslo', zona: '155,150 195,150 195,185 155,185' },
    { id: 'entero', nombre: 'Pollo Entero', zona: '90,90 220,90 220,190 90,190' },
  ];

  const cortesActuales = animalActual === 'vaca' ? cortesVaca : animalActual === 'cerdo' ? cortesCerdo : cortesPollo;

  const renderVaca = () => (
    <Svg height="280" width="320" viewBox="0 0 320 280">
      {/* Cuerpo principal - más robusto */}
      <Ellipse cx="155" cy="130" rx="90" ry="50" fill="#E5D5C0" stroke="#8B7355" strokeWidth="2.5" />
      
      {/* Cuello más definido */}
      <Path d="M 200 115 Q 215 105 230 105" fill="#D5C5B0" stroke="#8B7355" strokeWidth="2.5" />
      
      {/* Cabeza más grande y detallada */}
      <Ellipse cx="245" cy="105" rx="30" ry="24" fill="#D0C0A8" stroke="#8B7355" strokeWidth="2.5" />
      
      {/* Hocico */}
      <Ellipse cx="268" cy="110" rx="12" ry="10" fill="#B8A890" stroke="#8B7355" strokeWidth="2" />
      <Ellipse cx="265" cy="108" rx="2" ry="2.5" fill="#4A4A4A" />
      <Ellipse cx="271" cy="112" rx="2" ry="2.5" fill="#4A4A4A" />
      
      {/* Ojos más expresivos */}
      <Circle cx="252" cy="98" r="5" fill="#FFFFFF" stroke="#8B7355" strokeWidth="1.5" />
      <Circle cx="253" cy="98" r="3" fill="#2C1810" />
      <Circle cx="254" cy="97" r="1.5" fill="#FFFFFF" />
      
      {/* Orejas caídas */}
      <Ellipse cx="235" cy="88" rx="8" ry="16" fill="#C0B0A0" stroke="#8B7355" strokeWidth="2" 
               transform="rotate(-25 235 88)" />
      <Ellipse cx="255" cy="88" rx="8" ry="16" fill="#C0B0A0" stroke="#8B7355" strokeWidth="2" 
               transform="rotate(25 255 88)" />
      
      {/* Cuernos más prominentes */}
      <Path d="M 238 80 Q 235 68 240 60" stroke="#5A4A3A" strokeWidth="4" strokeLinecap="round" fill="none" />
      <Path d="M 252 80 Q 255 68 250 60" stroke="#5A4A3A" strokeWidth="4" strokeLinecap="round" fill="none" />
      
      {/* Manchas características */}
      <Ellipse cx="130" cy="115" rx="18" ry="12" fill="#8B7355" opacity="0.4" />
      <Ellipse cx="175" cy="140" rx="22" ry="15" fill="#8B7355" opacity="0.4" />
      <Ellipse cx="110" cy="145" rx="15" ry="10" fill="#8B7355" opacity="0.4" />
      
      {/* Patas más realistas con articulaciones */}
      <Path d="M 105 175 L 105 205 Q 105 212 102 218 L 102 235" 
            stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
      <Path d="M 135 175 L 135 205 Q 135 212 132 218 L 132 235" 
            stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
      <Path d="M 175 175 L 175 205 Q 175 212 172 218 L 172 235" 
            stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
      <Path d="M 205 175 L 205 205 Q 205 212 202 218 L 202 235" 
            stroke="#8B7355" strokeWidth="6" strokeLinecap="round" />
      
      {/* Pezuñas más detalladas */}
      <Ellipse cx="102" cy="240" rx="8" ry="10" fill="#4A4A4A" />
      <Path d="M 102 235 L 102 242" stroke="#2A2A2A" strokeWidth="1.5" />
      <Ellipse cx="132" cy="240" rx="8" ry="10" fill="#4A4A4A" />
      <Path d="M 132 235 L 132 242" stroke="#2A2A2A" strokeWidth="1.5" />
      <Ellipse cx="172" cy="240" rx="8" ry="10" fill="#4A4A4A" />
      <Path d="M 172 235 L 172 242" stroke="#2A2A2A" strokeWidth="1.5" />
      <Ellipse cx="202" cy="240" rx="8" ry="10" fill="#4A4A4A" />
      <Path d="M 202 235 L 202 242" stroke="#2A2A2A" strokeWidth="1.5" />
      
      {/* Ubre más visible */}
      <Ellipse cx="155" cy="168" rx="20" ry="10" fill="#F5E5D5" stroke="#8B7355" strokeWidth="1.5" />
      <Circle cx="148" cy="170" r="3" fill="#E0C8B8" />
      <Circle cx="155" cy="172" r="3" fill="#E0C8B8" />
      <Circle cx="162" cy="170" r="3" fill="#E0C8B8" />
      
      {/* Cola más tupida */}
      <Path d="M 65 130 Q 50 128 45 135 Q 42 140 45 145" 
            stroke="#8B7355" strokeWidth="4" strokeLinecap="round" fill="none" />
      <Path d="M 45 145 L 42 150 L 48 148 L 44 153 L 50 151 L 46 156" 
            stroke="#6A5A4A" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Zonas de cortes superpuestas */}
      {cortesVaca.map((corte) => (
        <Polygon
          key={corte.id}
          points={corte.zona}
          fill={corteSeleccionado === corte.id ? '#C41E3A' : 'transparent'}
          fillOpacity={corteSeleccionado === corte.id ? 0.6 : 0}
          stroke="#C41E3A"
          strokeWidth={corteSeleccionado === corte.id ? 3 : 1.5}
          strokeDasharray={corteSeleccionado === corte.id ? "0" : "5,5"}
          onPress={() => setCorteSeleccionado(corteSeleccionado === corte.id ? null : corte.id)}
        />
      ))}
    </Svg>
  );

  const renderCerdo = () => (
    <Svg height="280" width="320" viewBox="0 0 320 280">
      {/* Cuerpo principal - más redondeado */}
      <Ellipse cx="160" cy="125" rx="85" ry="45" fill="#FFB3BA" stroke="#D4757D" strokeWidth="2.5" />
      
      {/* Barriga más pronunciada */}
      <Ellipse cx="145" cy="145" rx="60" ry="25" fill="#FFC4C9" stroke="#D4757D" strokeWidth="2" />
      
      {/* Cuello robusto */}
      <Path d="M 205 115 Q 220 108 235 108" fill="#FFB3BA" stroke="#D4757D" strokeWidth="2.5" />
      
      {/* Cabeza más redonda */}
      <Circle cx="250" cy="108" r="26" fill="#FFA8B0" stroke="#D4757D" strokeWidth="2.5" />
      
      {/* Hocico característico */}
      <Ellipse cx="270" cy="108" rx="14" ry="11" fill="#FF9AA5" stroke="#D4757D" strokeWidth="2" />
      <Circle cx="267" cy="105" r="2.5" fill="#8B5A5F" />
      <Circle cx="273" cy="111" r="2.5" fill="#8B5A5F" />
      
      {/* Ojos pequeños */}
      <Circle cx="256" cy="98" r="4" fill="#FFFFFF" stroke="#D4757D" strokeWidth="1.5" />
      <Circle cx="257" cy="98" r="2.5" fill="#2C1810" />
      <Circle cx="258" cy="97" r="1" fill="#FFFFFF" />
      
      {/* Orejas triangulares caídas */}
      <Path d="M 240 88 L 235 75 L 245 82 Z" fill="#FFB3BA" stroke="#D4757D" strokeWidth="2" />
      <Path d="M 260 88 L 265 75 L 255 82 Z" fill="#FFB3BA" stroke="#D4757D" strokeWidth="2" />
      <Ellipse cx="240" cy="82" rx="6" ry="8" fill="#FFC4C9" stroke="none" />
      <Ellipse cx="260" cy="82" rx="6" ry="8" fill="#FFC4C9" stroke="none" />
      
      {/* Patas con articulaciones */}
      <Path d="M 110 165 L 110 195 Q 110 200 108 205 L 108 220" 
            stroke="#D4757D" strokeWidth="6" strokeLinecap="round" />
      <Path d="M 140 165 L 140 195 Q 140 200 138 205 L 138 220" 
            stroke="#D4757D" strokeWidth="6" strokeLinecap="round" />
      <Path d="M 180 165 L 180 195 Q 180 200 178 205 L 178 220" 
            stroke="#D4757D" strokeWidth="6" strokeLinecap="round" />
      <Path d="M 210 165 L 210 195 Q 210 200 208 205 L 208 220" 
            stroke="#D4757D" strokeWidth="6" strokeLinecap="round" />
      
      {/* Pezuñas partidas */}
      <Path d="M 105 220 L 105 228 M 111 220 L 111 228" stroke="#5A3A3F" strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M 135 220 L 135 228 M 141 220 L 141 228" stroke="#5A3A3F" strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M 175 220 L 175 228 M 181 220 L 181 228" stroke="#5A3A3F" strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M 205 220 L 205 228 M 211 220 L 211 228" stroke="#5A3A3F" strokeWidth="3.5" strokeLinecap="round" />
      
      {/* Cola enroscada más detallada */}
      <Path d="M 75 125 Q 62 122 56 128 Q 52 133 56 138 Q 60 143 66 141 Q 70 139 68 134" 
            stroke="#D4757D" strokeWidth="4" strokeLinecap="round" fill="none" />
      
      {/* Zonas de cortes superpuestas */}
      {cortesCerdo.map((corte) => (
        <Polygon
          key={corte.id}
          points={corte.zona}
          fill={corteSeleccionado === corte.id ? '#C41E3A' : 'transparent'}
          fillOpacity={corteSeleccionado === corte.id ? 0.6 : 0}
          stroke="#C41E3A"
          strokeWidth={corteSeleccionado === corte.id ? 3 : 1.5}
          strokeDasharray={corteSeleccionado === corte.id ? "0" : "5,5"}
          onPress={() => setCorteSeleccionado(corteSeleccionado === corte.id ? null : corte.id)}
        />
      ))}
    </Svg>
  );

  const renderPollo = () => (
    <Svg height="280" width="320" viewBox="0 0 320 280">
      {/* Cuerpo principal más redondeado */}
      <Ellipse cx="155" cy="135" rx="65" ry="55" fill="#FFEECC" stroke="#D4A574" strokeWidth="2.5" />
      
      {/* Pechuga marcada */}
      <Ellipse cx="155" cy="125" rx="45" ry="35" fill="#FFF5DD" stroke="#D4A574" strokeWidth="1.5" />
      
      {/* Cuello */}
      <Path d="M 195 120 Q 210 110 220 105" fill="#FFEECC" stroke="#D4A574" strokeWidth="2.5" />
      
      {/* Cabeza más definida */}
      <Circle cx="230" cy="98" r="20" fill="#FFE5B8" stroke="#D4A574" strokeWidth="2.5" />
      
      {/* Pico más prominente */}
      <Path d="M 246 98 L 258 94 L 258 102 Z" fill="#FF9944" stroke="#CC7733" strokeWidth="2" />
      <Path d="M 246 98 L 246 102 L 258 102 Z" fill="#FFAA55" stroke="#CC7733" strokeWidth="1.5" />
      
      {/* Cresta más elaborada */}
      <Path d="M 218 82 Q 222 72 226 82 Q 230 70 234 82 Q 238 72 242 82 Q 246 75 248 82" 
            fill="#FF3333" stroke="#CC0000" strokeWidth="1.5" />
      <Path d="M 218 82 Q 220 80 222 82 M 226 82 Q 228 78 230 82 M 234 82 Q 236 80 238 82" 
            stroke="#CC0000" strokeWidth="1" opacity="0.5" />
      
      {/* Barbilla (wattle) */}
      <Ellipse cx="233" cy="112" rx="5" ry="8" fill="#FF3333" stroke="#CC0000" strokeWidth="1.5" />
      <Ellipse cx="240" cy="114" rx="4" ry="6" fill="#FF3333" stroke="#CC0000" strokeWidth="1.5" />
      
      {/* Ojo más expresivo */}
      <Circle cx="237" cy="92" r="4.5" fill="#FFFFFF" stroke="#D4A574" strokeWidth="1.5" />
      <Circle cx="238" cy="92" r="3" fill="#2C1810" />
      <Circle cx="239" cy="91" r="1.5" fill="#FFFFFF" />
      
      {/* Ala izquierda más detallada */}
      <Ellipse cx="110" cy="115" rx="25" ry="20" fill="#FFF8E1" stroke="#D4A574" strokeWidth="2.5" 
               transform="rotate(-15 110 115)" />
      <Path d="M 100 110 Q 95 115 100 120" stroke="#D4A574" strokeWidth="1.5" fill="none" />
      <Path d="M 105 108 Q 100 113 105 118" stroke="#D4A574" strokeWidth="1.5" fill="none" />
      <Path d="M 110 107 Q 105 112 110 117" stroke="#D4A574" strokeWidth="1.5" fill="none" />
      
      {/* Ala derecha más detallada */}
      <Ellipse cx="200" cy="115" rx="25" ry="20" fill="#FFF8E1" stroke="#D4A574" strokeWidth="2.5" 
               transform="rotate(15 200 115)" />
      <Path d="M 210 110 Q 215 115 210 120" stroke="#D4A574" strokeWidth="1.5" fill="none" />
      <Path d="M 205 108 Q 210 113 205 118" stroke="#D4A574" strokeWidth="1.5" fill="none" />
      <Path d="M 200 107 Q 205 112 200 117" stroke="#D4A574" strokeWidth="1.5" fill="none" />
      
      {/* Patas con más detalle */}
      <Path d="M 135 185 L 132 210 M 140 185 L 137 210" 
            stroke="#FFAA44" strokeWidth="4" strokeLinecap="round" />
      <Path d="M 170 185 L 167 210 M 175 185 L 172 210" 
            stroke="#FFAA44" strokeWidth="4" strokeLinecap="round" />
      
      {/* Garras más definidas */}
      <Path d="M 128 210 L 122 218 M 132 210 L 126 218 M 136 210 L 130 218 M 132 210 L 132 220" 
            stroke="#CC7733" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M 163 210 L 157 218 M 167 210 L 161 218 M 171 210 L 165 218 M 167 210 L 167 220" 
            stroke="#CC7733" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Cola con plumas */}
      <Path d="M 90 135 Q 75 132 68 138 Q 62 144 68 152 Q 74 158 85 155 Q 92 153 95 148" 
            fill="#FFF8E1" stroke="#D4A574" strokeWidth="2.5" />
      <Path d="M 85 138 Q 70 135 65 142 M 82 145 Q 68 143 64 149 M 80 152 Q 67 151 65 156" 
            stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      
      {/* Plumas decorativas en el cuerpo */}
      <Path d="M 120 125 Q 118 130 120 135 M 125 120 Q 123 125 125 130 M 130 118 Q 128 123 130 128" 
            stroke="#D4A574" strokeWidth="1" opacity="0.5" />
      
      {/* Zonas de cortes superpuestas */}
      {cortesPollo.map((corte) => (
        <Polygon
          key={corte.id}
          points={corte.zona}
          fill={corteSeleccionado === corte.id ? '#C41E3A' : 'transparent'}
          fillOpacity={corteSeleccionado === corte.id ? 0.6 : 0}
          stroke="#C41E3A"
          strokeWidth={corteSeleccionado === corte.id ? 3 : 1.5}
          strokeDasharray={corteSeleccionado === corte.id ? "0" : "5,5"}
          onPress={() => setCorteSeleccionado(corteSeleccionado === corte.id ? null : corte.id)}
        />
      ))}
    </Svg>
  );

  return (
    <View style={styles.diagramaContainer}>
      {/* Botón cambiar animal */}
      <TouchableOpacity 
        style={styles.menuAnimalButton}
        onPress={() => setMostrarMenuAnimal(!mostrarMenuAnimal)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#1a1a1a" />
      </TouchableOpacity>

      {mostrarMenuAnimal && (
        <View style={styles.menuAnimal}>
          <TouchableOpacity 
            style={[styles.menuItem, animalActual === 'vaca' && styles.menuItemActive]}
            onPress={() => { setAnimalActual('vaca'); setMostrarMenuAnimal(false); setCorteSeleccionado(null); }}
          >
            <Text style={styles.menuItemText}>🐄 Vaca</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.menuItem, animalActual === 'cerdo' && styles.menuItemActive]}
            onPress={() => { setAnimalActual('cerdo'); setMostrarMenuAnimal(false); setCorteSeleccionado(null); }}
          >
            <Text style={styles.menuItemText}>🐷 Cerdo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.menuItem, animalActual === 'pollo' && styles.menuItemActive]}
            onPress={() => { setAnimalActual('pollo'); setMostrarMenuAnimal(false); setCorteSeleccionado(null); }}
          >
            <Text style={styles.menuItemText}>🐔 Pollo</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.animalTitle}>
        {animalActual === 'vaca' ? '🐄 Cortes de Vaca' : animalActual === 'cerdo' ? '🐷 Cortes de Cerdo' : '🐔 Cortes de Pollo'}
      </Text>

      {/* Diagrama mejorado según el animal */}
      <View style={styles.diagramaSvg}>
        {animalActual === 'vaca' && renderVaca()}
        {animalActual === 'cerdo' && renderCerdo()}
        {animalActual === 'pollo' && renderPollo()}
      </View>

      {/* Leyenda de cortes */}
      <View style={styles.leyenda}>
        {cortesActuales.map((corte) => (
          <TouchableOpacity
            key={corte.id}
            style={[
              styles.corteChip,
              corteSeleccionado === corte.id && styles.corteChipActive
            ]}
            onPress={() => setCorteSeleccionado(corteSeleccionado === corte.id ? null : corte.id)}
          >
            <Text style={[
              styles.corteChipText,
              corteSeleccionado === corte.id && styles.corteChipTextActive
            ]}>
              {corte.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  diagramaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuAnimalButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
  },
  menuAnimal: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
  },
  menuItem: {
    padding: 12,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: '#FFE5E5',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  animalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  diagramaSvg: {
    marginVertical: 20,
  },
  leyenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
    justifyContent: 'center',
  },
  corteChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  corteChipActive: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  corteChipText: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  corteChipTextActive: {
    color: '#FFFFFF',
  },
});