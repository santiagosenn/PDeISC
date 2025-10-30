import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AnimalComponent from '../components/Animal';
import CookComponent from '../components/Cook';
import TimeComponent from '../components/Time';

type Animal = 'vaca' | 'cerdo' | 'pollo';
type Filtro = 'corte' | 'metodo' | 'tiempo';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [animalActual, setAnimalActual] = useState<Animal>('vaca');
  const [filtroActual, setFiltroActual] = useState<Filtro>('corte');
  const [corteSeleccionado, setCorteSeleccionado] = useState<string | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string | null>(null);
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState<string | null>(null);
  const [mostrarMenuAnimal, setMostrarMenuAnimal] = useState(false);
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Solo buscar automáticamente cuando no hay texto
    if (!searchQuery.trim()) {
      buscarRecetas();
    }
  }, [corteSeleccionado, metodoSeleccionado, tiempoSeleccionado]);

  const handleBuscar = () => {
    buscarRecetas();
  };

  const buscarRecetas = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3000/recetas');
      const data = await response.json();
      
      if (data.success) {
        let recetasFiltradas = data.recetas;

        // Filtrar por texto de búsqueda
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          recetasFiltradas = recetasFiltradas.filter((receta: any) => 
            receta.nombre.toLowerCase().includes(query) ||
            receta.descripcion?.toLowerCase().includes(query) ||
            receta.ingredientes?.toLowerCase().includes(query)
          );
        }

        // Filtrar por corte
        if (corteSeleccionado) {
          const cortesVaca = [
            { id: 'bife-chorizo', nombre: 'Bife de Chorizo' },
            { id: 'lomo', nombre: 'Lomo' },
            { id: 'asado', nombre: 'Asado de Tira' },
            { id: 'vacio', nombre: 'Vacío' },
            { id: 'entraña', nombre: 'Entraña' },
            { id: 'costilla', nombre: 'Costilla' },
          ];
          const cortesCerdo = [
            { id: 'chuleta', nombre: 'Chuleta' },
            { id: 'lomo-cerdo', nombre: 'Lomo' },
            { id: 'panceta', nombre: 'Panceta' },
            { id: 'costillar', nombre: 'Costillar' },
          ];
          const cortesPollo = [
            { id: 'pechuga', nombre: 'Pechuga' },
            { id: 'muslo', nombre: 'Muslo' },
            { id: 'ala', nombre: 'Ala' },
            { id: 'entero', nombre: 'Pollo Entero' },
          ];
          
          const cortesActuales = animalActual === 'vaca' ? cortesVaca : animalActual === 'cerdo' ? cortesCerdo : cortesPollo;
          const nombreCorte = cortesActuales.find(c => c.id === corteSeleccionado)?.nombre;
          recetasFiltradas = recetasFiltradas.filter((receta: any) => 
            receta.tipo_corte?.toLowerCase().includes(nombreCorte?.toLowerCase() || '')
          );
        }

        // Filtrar por método
        if (metodoSeleccionado) {
          const metodosCoccion = [
            { id: 'parrilla', nombre: 'Parrilla' },
            { id: 'horno', nombre: 'Horno' },
            { id: 'sarten', nombre: 'Sartén' },
            { id: 'ahumado', nombre: 'Ahumado' },
          ];
          const nombreMetodo = metodosCoccion.find(m => m.id === metodoSeleccionado)?.nombre;
          recetasFiltradas = recetasFiltradas.filter((receta: any) => 
            receta.metodo_coccion?.toLowerCase().includes(nombreMetodo?.toLowerCase() || '')
          );
        }

        // Filtrar por tiempo
        if (tiempoSeleccionado) {
          const tiemposPreparacion = [
            { id: 'rapido', nombre: 'Rápido (< 30 min)' },
            { id: 'medio', nombre: 'Medio (30-60 min)' },
            { id: 'largo', nombre: 'Largo (> 60 min)' },
          ];
          const tiempo = tiemposPreparacion.find(t => t.id === tiempoSeleccionado);
          if (tiempo) {
            if (tiempo.id === 'rapido') {
              recetasFiltradas = recetasFiltradas.filter((receta: any) => 
                receta.tiempo_preparacion && receta.tiempo_preparacion < 30
              );
            } else if (tiempo.id === 'medio') {
              recetasFiltradas = recetasFiltradas.filter((receta: any) => 
                receta.tiempo_preparacion && receta.tiempo_preparacion >= 30 && receta.tiempo_preparacion <= 60
              );
            } else if (tiempo.id === 'largo') {
              recetasFiltradas = recetasFiltradas.filter((receta: any) => 
                receta.tiempo_preparacion && receta.tiempo_preparacion > 60
              );
            }
          }
        }

        setRecetas(recetasFiltradas);
      }
    } catch (e) {
      console.error('Error al buscar recetas:', e);
    } finally {
      setLoading(false);
    }
  };

  const cambiarFiltro = (direccion: 'prev' | 'next') => {
    const filtros: Filtro[] = ['corte', 'metodo', 'tiempo'];
    const indexActual = filtros.indexOf(filtroActual);
    
    if (direccion === 'next') {
      setFiltroActual(filtros[(indexActual + 1) % filtros.length]);
    } else {
      setFiltroActual(filtros[(indexActual - 1 + filtros.length) % filtros.length]);
    }
  };

  const getNombreCorte = () => {
    const cortesVaca = [
      { id: 'bife-chorizo', nombre: 'Bife de Chorizo' },
      { id: 'lomo', nombre: 'Lomo' },
      { id: 'asado', nombre: 'Asado de Tira' },
      { id: 'vacio', nombre: 'Vacío' },
      { id: 'entraña', nombre: 'Entraña' },
      { id: 'costilla', nombre: 'Costilla' },
    ];
    const cortesCerdo = [
      { id: 'chuleta', nombre: 'Chuleta' },
      { id: 'lomo-cerdo', nombre: 'Lomo' },
      { id: 'panceta', nombre: 'Panceta' },
      { id: 'costillar', nombre: 'Costillar' },
    ];
    const cortesPollo = [
      { id: 'pechuga', nombre: 'Pechuga' },
      { id: 'muslo', nombre: 'Muslo' },
      { id: 'ala', nombre: 'Ala' },
      { id: 'entero', nombre: 'Pollo Entero' },
    ];
    
    const cortesActuales = animalActual === 'vaca' ? cortesVaca : animalActual === 'cerdo' ? cortesCerdo : cortesPollo;
    return cortesActuales.find(c => c.id === corteSeleccionado)?.nombre;
  };

  const getNombreMetodo = () => {
    const metodosCoccion = [
      { id: 'parrilla', nombre: 'Parrilla' },
      { id: 'horno', nombre: 'Horno' },
      { id: 'sarten', nombre: 'Sartén' },
      { id: 'ahumado', nombre: 'Ahumado' },
    ];
    return metodosCoccion.find(m => m.id === metodoSeleccionado)?.nombre;
  };

  const getNombreTiempo = () => {
    const tiemposPreparacion = [
      { id: 'rapido', nombre: 'Rápido (< 30 min)' },
      { id: 'medio', nombre: 'Medio (30-60 min)' },
      { id: 'largo', nombre: 'Largo (> 60 min)' },
    ];
    return tiemposPreparacion.find(t => t.id === tiempoSeleccionado)?.nombre;
  };

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar recetas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            onSubmitEditing={handleBuscar}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleBuscar}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Navegación de filtros */}
        <View style={styles.filtroNav}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => cambiarFiltro('prev')}
          >
            <Ionicons name="chevron-back" size={28} color="#C41E3A" />
          </TouchableOpacity>

          <View style={styles.filtroIndicator}>
            <Text style={styles.filtroIndicatorText}>
              {filtroActual === 'corte' ? 'Corte de Carne' : 
               filtroActual === 'metodo' ? 'Método de Cocción' : 
               'Tiempo de Preparación'}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => cambiarFiltro('next')}
          >
            <Ionicons name="chevron-forward" size={28} color="#C41E3A" />
          </TouchableOpacity>
        </View>

        {/* Contenido del filtro actual */}
        <View style={styles.filtroContent}>
          {filtroActual === 'corte' && (
            <AnimalComponent
              animalActual={animalActual}
              setAnimalActual={setAnimalActual}
              corteSeleccionado={corteSeleccionado}
              setCorteSeleccionado={setCorteSeleccionado}
              mostrarMenuAnimal={mostrarMenuAnimal}
              setMostrarMenuAnimal={setMostrarMenuAnimal}
            />
          )}
          {filtroActual === 'metodo' && (
            <CookComponent
              metodoSeleccionado={metodoSeleccionado}
              setMetodoSeleccionado={setMetodoSeleccionado}
            />
          )}
          {filtroActual === 'tiempo' && (
            <TimeComponent
              tiempoSeleccionado={tiempoSeleccionado}
              setTiempoSeleccionado={setTiempoSeleccionado}
            />
          )}
        </View>

        {/* Filtros activos */}
        {(corteSeleccionado || metodoSeleccionado || tiempoSeleccionado) && (
          <View style={styles.filtrosActivos}>
            <Text style={styles.filtrosActivosTitle}>Filtros activos:</Text>
            <View style={styles.filtrosActivosChips}>
              {corteSeleccionado && (
                <View style={styles.chipActivo}>
                  <Text style={styles.chipActivoText}>
                    {getNombreCorte()}
                  </Text>
                  <TouchableOpacity onPress={() => setCorteSeleccionado(null)}>
                    <Ionicons name="close-circle" size={18} color="#C41E3A" />
                  </TouchableOpacity>
                </View>
              )}
              {metodoSeleccionado && (
                <View style={styles.chipActivo}>
                  <Text style={styles.chipActivoText}>
                    {getNombreMetodo()}
                  </Text>
                  <TouchableOpacity onPress={() => setMetodoSeleccionado(null)}>
                    <Ionicons name="close-circle" size={18} color="#C41E3A" />
                  </TouchableOpacity>
                </View>
              )}
              {tiempoSeleccionado && (
                <View style={styles.chipActivo}>
                  <Text style={styles.chipActivoText}>
                    {getNombreTiempo()}
                  </Text>
                  <TouchableOpacity onPress={() => setTiempoSeleccionado(null)}>
                    <Ionicons name="close-circle" size={18} color="#C41E3A" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Resultados */}
        <View style={styles.resultados}>
          <Text style={styles.resultadosTitle}>
            Resultados {recetas.length > 0 && `(${recetas.length})`}
          </Text>
          
          {loading ? (
            <View style={styles.loadingResults}>
              <ActivityIndicator size="large" color="#C41E3A" />
            </View>
          ) : recetas.length > 0 ? (
            <View style={styles.recetasList}>
              {recetas.map((receta: any) => (
                <TouchableOpacity
                  key={receta.id}
                  style={styles.recetaCard}
                  onPress={() => router.push(`/recipe-detail?id=${receta.id}`)}
                >
                  {receta.foto_url ? (
                    <Image 
                      source={{ uri: receta.foto_url }} 
                      style={styles.recetaImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.recetaImagePlaceholder}>
                      <Ionicons name="restaurant" size={40} color="#999" />
                    </View>
                  )}
                  <View style={styles.recetaInfo}>
                    <Text style={styles.recetaNombre} numberOfLines={2}>
                      {receta.nombre}
                    </Text>
                    {receta.descripcion && (
                      <Text style={styles.recetaDescripcion} numberOfLines={2}>
                        {receta.descripcion}
                      </Text>
                    )}
                    <View style={styles.recetaMeta}>
                      {receta.tipo_corte && (
                        <View style={styles.metaTag}>
                          <Ionicons name="cut" size={12} color="#C41E3A" />
                          <Text style={styles.metaText}>{receta.tipo_corte}</Text>
                        </View>
                      )}
                      {receta.metodo_coccion && (
                        <View style={styles.metaTag}>
                          <Ionicons name="flame" size={12} color="#C41E3A" />
                          <Text style={styles.metaText}>{receta.metodo_coccion}</Text>
                        </View>
                      )}
                      {receta.tiempo_preparacion && (
                        <View style={styles.metaTag}>
                          <Ionicons name="time" size={12} color="#C41E3A" />
                          <Text style={styles.metaText}>{receta.tiempo_preparacion} min</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.recetaAutor}>Por @{receta.usuario_nombre}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyResults}>
              <Ionicons name="search-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>No se encontraron recetas</Text>
              <Text style={styles.emptySubtext}>
                Intenta cambiar los filtros o la búsqueda
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButton: {
    backgroundColor: '#C41E3A',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  filtroNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navButton: {
    padding: 8,
  },
  filtroIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  filtroIndicatorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  filtroContent: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filtrosActivos: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filtrosActivosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  filtrosActivosChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipActivo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  chipActivoText: {
    fontSize: 14,
    color: '#C41E3A',
    fontWeight: '600',
  },
  resultados: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  resultadosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  loadingResults: {
    padding: 40,
    alignItems: 'center',
  },
  recetasList: {
    gap: 12,
  },
  recetaCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recetaImage: {
    width: 120,
    height: 120,
    backgroundColor: '#E0E0E0',
  },
  recetaImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recetaInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  recetaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  recetaDescripcion: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  recetaMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#C41E3A',
    fontWeight: '600',
  },
  recetaAutor: {
    fontSize: 12,
    color: '#999',
  },
  emptyResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
  },
});