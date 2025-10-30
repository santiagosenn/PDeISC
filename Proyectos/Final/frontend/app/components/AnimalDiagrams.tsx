import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path, Polygon, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface AnimalDiagramProps {
  animal: 'vaca' | 'cerdo' | 'pollo';
  corteSeleccionado: string | null;
  onCortePress: (corteId: string) => void;
}

export const cortesVaca = [
  { id: 'cuadril', nombre: 'Cuadril', zona: '85,100 115,100 120,130 90,135' },
  { id: 'bife-chorizo', nombre: 'Bife de Chorizo', zona: '125,95 165,95 165,125 125,125' },
  { id: 'lomo', nombre: 'Lomo', zona: '125,130 165,130 165,150 125,150' },
  { id: 'asado', nombre: 'Asado de Tira', zona: '125,155 165,155 165,185 125,185' },
  { id: 'vacio', nombre: 'Vacío', zona: '85,140 115,140 120,170 90,175' },
  { id: 'entraña', nombre: 'Entraña', zona: '100,150 120,150 120,165 100,165' },
  { id: 'paleta', nombre: 'Paleta', zona: '175,105 200,110 195,140 170,135' },
  { id: 'aguja', nombre: 'Aguja', zona: '170,95 195,95 200,110 175,105' },
];

export const cortesCerdo = [
  { id: 'chuleta', nombre: 'Chuleta', zona: '125,100 160,100 160,135 125,135' },
  { id: 'lomo-cerdo', nombre: 'Lomo', zona: '125,140 160,140 160,165 125,165' },
  { id: 'panceta', nombre: 'Panceta', zona: '90,145 120,145 120,175 90,175' },
  { id: 'costillar', nombre: 'Costillar', zona: '125,105 155,105 155,130 125,130' },
  { id: 'paleta-cerdo', nombre: 'Paleta', zona: '170,110 195,115 190,145 165,140' },
  { id: 'jamón', nombre: 'Jamón', zona: '85,105 115,105 115,140 85,140' },
];

export const cortesPollo = [
  { id: 'pechuga', nombre: 'Pechuga', zona: '125,120 155,120 155,160 125,160' },
  { id: 'muslo', nombre: 'Muslo', zona: '95,165 125,165 125,195 95,195' },
  { id: 'pierna', nombre: 'Pierna', zona: '155,165 185,165 185,195 155,195' },
  { id: 'ala', nombre: 'Ala', zona: '165,115 190,120 185,140 160,135' },
  { id: 'contramuslo', nombre: 'Contramuslo', zona: '95,140 125,140 125,160 95,160' },
];

const DiagramaVaca: React.FC<{ corteSeleccionado: string | null; onPress: (id: string) => void }> = ({ corteSeleccionado, onPress }) => {
  return (
    <Svg height="280" width="300" viewBox="0 0 300 280">
      <Defs>
        <LinearGradient id="vacaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#D4A574" stopOpacity="1" />
          <Stop offset="1" stopColor="#B8865F" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Cuerpo principal */}
      <Path
        d="M 80 110 Q 75 95 90 90 L 170 85 Q 190 85 195 100 L 200 105 Q 205 110 205 120 L 205 175 Q 205 190 195 195 L 185 195 Q 180 200 170 200 L 95 200 Q 85 200 80 190 L 75 180 Q 70 170 70 155 L 70 125 Q 70 115 80 110 Z"
        fill="url(#vacaGrad)"
        stroke="#8B6F47"
        strokeWidth="2.5"
      />

      {/* Cabeza */}
      <Ellipse cx="212" cy="115" rx="18" ry="22" fill="#C9956C" stroke="#8B6F47" strokeWidth="2" />
      <Ellipse cx="218" cy="110" rx="8" ry="10" fill="#B8865F" stroke="#8B6F47" strokeWidth="1.5" />
      
      {/* Ojo */}
      <Ellipse cx="210" cy="112" rx="3" ry="4" fill="#2C1810" />

      {/* Cuernos */}
      <Path d="M 205 98 Q 200 90 198 88" stroke="#8B6F47" strokeWidth="2.5" fill="none" />
      <Path d="M 218 98 Q 223 90 225 88" stroke="#8B6F47" strokeWidth="2.5" fill="none" />

      {/* Orejas */}
      <Ellipse cx="202" cy="108" rx="4" ry="7" fill="#B8865F" stroke="#8B6F47" strokeWidth="1" />
      <Ellipse cx="222" cy="108" rx="4" ry="7" fill="#B8865F" stroke="#8B6F47" strokeWidth="1" />

      {/* Patas */}
      <Path d="M 95 200 L 95 245 M 90 245 L 100 245" stroke="#8B6F47" strokeWidth="4" strokeLinecap="round" />
      <Path d="M 125 200 L 125 250 M 120 250 L 130 250" stroke="#8B6F47" strokeWidth="4" strokeLinecap="round" />
      <Path d="M 155 200 L 155 250 M 150 250 L 160 250" stroke="#8B6F47" strokeWidth="4" strokeLinecap="round" />
      <Path d="M 180 195 L 180 240 M 175 240 L 185 240" stroke="#8B6F47" strokeWidth="4" strokeLinecap="round" />

      {/* Cola */}
      <Path d="M 75 165 Q 65 170 60 180 Q 58 185 62 188" stroke="#8B6F47" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Ellipse cx="62" cy="190" rx="3" ry="5" fill="#8B6F47" />

      {/* Ubre (detalle) */}
      <Ellipse cx="130" cy="195" rx="12" ry="8" fill="#E8D4C4" stroke="#8B6F47" strokeWidth="1" />

      {/* Zonas clicleables */}
      {cortesVaca.map((corte) => (
        <Polygon
          key={corte.id}
          points={corte.zona}
          fill={corteSeleccionado === corte.id ? '#C41E3A' : 'transparent'}
          fillOpacity={corteSeleccionado === corte.id ? 0.5 : 0}
          stroke="#C41E3A"
          strokeWidth={corteSeleccionado === corte.id ? 3 : 1.5}
          strokeDasharray={corteSeleccionado === corte.id ? "0" : "4,3"}
          onPress={() => onPress(corte.id)}
        />
      ))}
    </Svg>
  );
};

const DiagramaCerdo: React.FC<{ corteSeleccionado: string | null; onPress: (id: string) => void }> = ({ corteSeleccionado, onPress }) => {
  return (
    <Svg height="280" width="300" viewBox="0 0 300 280">
      <Defs>
        <LinearGradient id="cerdoGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFC0CB" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFB6C1" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Cuerpo principal */}
      <Path
        d="M 85 115 Q 80 100 95 95 L 165 90 Q 185 90 190 105 L 195 110 Q 200 115 200 125 L 200 175 Q 200 188 190 193 L 180 195 Q 175 198 165 198 L 100 198 Q 90 198 85 188 L 80 178 Q 75 168 75 153 L 75 130 Q 75 120 85 115 Z"
        fill="url(#cerdoGrad)"
        stroke="#D4699B"
        strokeWidth="2.5"
      />

      {/* Cabeza */}
      <Ellipse cx="207" cy="120" rx="16" ry="20" fill="#FFB6C1" stroke="#D4699B" strokeWidth="2" />
      
      {/* Hocico */}
      <Ellipse cx="215" cy="125" rx="10" ry="8" fill="#FFA5B8" stroke="#D4699B" strokeWidth="2" />
      <Ellipse cx="212" cy="125" rx="2.5" ry="2" fill="#8B4564" />
      <Ellipse cx="218" cy="125" rx="2.5" ry="2" fill="#8B4564" />

      {/* Ojo */}
      <Ellipse cx="205" cy="115" rx="3" ry="4" fill="#2C1810" />

      {/* Orejas triangulares */}
      <Path d="M 200 105 L 195 95 L 202 100 Z" fill="#FFB6C1" stroke="#D4699B" strokeWidth="1.5" />
      <Path d="M 215 105 L 220 95 L 213 100 Z" fill="#FFB6C1" stroke="#D4699B" strokeWidth="1.5" />

      {/* Patas */}
      <Path d="M 100 198 L 100 240 M 95 240 L 105 240" stroke="#D4699B" strokeWidth="4" strokeLinecap="round" />
      <Path d="M 130 198 L 130 245 M 125 245 L 135 245" stroke="#D4699B" strokeWidth="4" strokeLinecap="round" />
      <Path d="M 155 198 L 155 245 M 150 245 L 160 245" stroke="#D4699B" strokeWidth="4" strokeLinecap="round" />
      <Path d="M 180 195 L 180 235 M 175 235 L 185 235" stroke="#D4699B" strokeWidth="4" strokeLinecap="round" />

      {/* Cola en espiral */}
      <Path 
        d="M 75 165 Q 68 168 65 175 Q 63 180 67 182 Q 70 183 72 180 Q 73 177 70 175" 
        stroke="#D4699B" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round" 
      />

      {/* Zonas clicleables */}
      {cortesCerdo.map((corte) => (
        <Polygon
          key={corte.id}
          points={corte.zona}
          fill={corteSeleccionado === corte.id ? '#C41E3A' : 'transparent'}
          fillOpacity={corteSeleccionado === corte.id ? 0.5 : 0}
          stroke="#C41E3A"
          strokeWidth={corteSeleccionado === corte.id ? 3 : 1.5}
          strokeDasharray={corteSeleccionado === corte.id ? "0" : "4,3"}
          onPress={() => onPress(corte.id)}
        />
      ))}
    </Svg>
  );
};

const DiagramaPollo: React.FC<{ corteSeleccionado: string | null; onPress: (id: string) => void }> = ({ corteSeleccionado, onPress }) => {
  return (
    <Svg height="280" width="300" viewBox="0 0 300 280">
      <Defs>
        <LinearGradient id="polloGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F5E6D3" stopOpacity="1" />
          <Stop offset="1" stopColor="#E8D4C4" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Cuerpo principal (más redondeado) */}
      <Ellipse cx="140" cy="145" rx="45" ry="55" fill="url(#polloGrad)" stroke="#C4A57B" strokeWidth="2.5" />

      {/* Cabeza */}
      <Ellipse cx="145" cy="100" rx="18" ry="20" fill="#F5E6D3" stroke="#C4A57B" strokeWidth="2" />

      {/* Pico */}
      <Path d="M 160 100 L 170 100 L 160 105 Z" fill="#FFA500" stroke="#D4902A" strokeWidth="1.5" />

      {/* Ojo */}
      <Ellipse cx="152" cy="97" rx="3" ry="4" fill="#2C1810" />

      {/* Cresta */}
      <Path 
        d="M 140 85 Q 138 78 140 75 Q 142 78 145 75 Q 147 78 150 76 Q 152 80 154 85" 
        fill="#DC143C" 
        stroke="#B01030" 
        strokeWidth="1.5" 
      />

      {/* Barbilla */}
      <Path d="M 158 108 Q 160 112 158 115 Q 156 112 158 108" fill="#DC143C" stroke="#B01030" strokeWidth="1" />

      {/* Alas */}
      <Ellipse cx="170" cy="130" rx="18" ry="25" fill="#E8D4C4" stroke="#C4A57B" strokeWidth="2" transform="rotate(25 170 130)" />
      <Ellipse cx="110" cy="130" rx="18" ry="25" fill="#E8D4C4" stroke="#C4A57B" strokeWidth="2" transform="rotate(-25 110 130)" />

      {/* Plumas en ala (detalle) */}
      <Path d="M 165 120 Q 175 125 180 135" stroke="#C4A57B" strokeWidth="1" fill="none" />
      <Path d="M 167 130 Q 177 133 183 140" stroke="#C4A57B" strokeWidth="1" fill="none" />

      {/* Patas */}
      <Path d="M 125 195 L 120 235 M 115 235 L 120 235 L 125 240" stroke="#FFA500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M 115 240 L 120 235 L 125 240" stroke="#FFA500" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      <Path d="M 155 195 L 160 235 M 155 235 L 160 235 L 165 240" stroke="#FFA500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M 155 240 L 160 235 L 165 240" stroke="#FFA500" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Cola */}
      <Path 
        d="M 95 155 Q 85 160 78 168 Q 75 172 78 175 Q 82 170 90 165" 
        fill="#E8D4C4" 
        stroke="#C4A57B" 
        strokeWidth="2" 
      />

      {/* Zonas clicleables */}
      {cortesPollo.map((corte) => (
        <Polygon
          key={corte.id}
          points={corte.zona}
          fill={corteSeleccionado === corte.id ? '#C41E3A' : 'transparent'}
          fillOpacity={corteSeleccionado === corte.id ? 0.5 : 0}
          stroke="#C41E3A"
          strokeWidth={corteSeleccionado === corte.id ? 3 : 1.5}
          strokeDasharray={corteSeleccionado === corte.id ? "0" : "4,3"}
          onPress={() => onPress(corte.id)}
        />
      ))}
    </Svg>
  );
};

export const AnimalDiagram: React.FC<AnimalDiagramProps> = ({ animal, corteSeleccionado, onCortePress }) => {
  return (
    <View style={styles.container}>
      {animal === 'vaca' && <DiagramaVaca corteSeleccionado={corteSeleccionado} onPress={onCortePress} />}
      {animal === 'cerdo' && <DiagramaCerdo corteSeleccionado={corteSeleccionado} onPress={onCortePress} />}
      {animal === 'pollo' && <DiagramaPollo corteSeleccionado={corteSeleccionado} onPress={onCortePress} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});