import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { recetasEvents } from '../utils/events';
import AnimalComponent from '../components/Animal';
import CookComponent from '../components/Cook';
import TimeComponent from '../components/Time';

type Animal = 'vaca' | 'cerdo' | 'pollo';
type Filtro = 'corte' | 'metodo' | 'tiempo';

export default function CreateScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ingredientes, setIngredientes] = useState<string[]>([]);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  
  // Cambio: Ahora pasos es un array como ingredientes
  const [pasos, setPasos] = useState<string[]>([]);
  const [nuevoPaso, setNuevoPaso] = useState('');
  
  // Estados para los filtros (ahora son para definir la receta)
  const [animalActual, setAnimalActual] = useState<Animal>('vaca');
  const [filtroActual, setFiltroActual] = useState<Filtro>('corte');
  const [corteSeleccionado, setCorteSeleccionado] = useState<string | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string | null>(null);
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState<string | null>(null);
  const [mostrarMenuAnimal, setMostrarMenuAnimal] = useState(false);
  
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estados para errores de validación
  const [errores, setErrores] = useState({
    nombre: '',
    descripcion: '',
    filtros: '',
  });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      let base64 = result.assets[0].base64;
      
      if (!base64 && uri.startsWith('blob:')) {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              const base64Data = result.split(',')[1];
              resolve(base64Data);
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error converting blob to base64:', error);
          alert('Error al procesar la imagen');
          return;
        }
      }

      let extension = 'jpg';
      if (uri.includes('.png') || result.assets[0].type?.includes('png')) {
        extension = 'png';
      } else if (uri.includes('.jpeg') || uri.includes('.jpg') || result.assets[0].type?.includes('jpeg')) {
        extension = 'jpg';
      }

      const base64Completo = `data:image/${extension};base64,${base64}`;
      setFoto(uri);
      
      if (base64Completo) {
        await subirImagen(base64Completo, extension);
      }
    }
  };

  const subirImagen = async (base64: string, extension: string) => {
    setUploadingImage(true);
    try {
      const response = await fetch('http://127.0.0.1:3000/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagen: base64,
          extension: extension,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFotoUrl(data.url);
        console.log('✅ Imagen subida:', data.url);
      } else {
        console.error('Error al subir imagen:', data.error);
        alert('Error al subir la imagen: ' + data.error);
        setFoto(null);
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Verifica tu conexión.');
      setFoto(null);
    } finally {
      setUploadingImage(false);
    }
  };

  // Validación del nombre de la receta
  const validarNombre = (texto: string) => {
    const soloLetrasEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    
    if (!texto.trim()) {
      return 'El nombre es obligatorio';
    }
    if (texto.trim().length < 4) {
      return 'El nombre debe tener al menos 4 caracteres';
    }
    if (!soloLetrasEspacios.test(texto)) {
      return 'El nombre solo puede contener letras y espacios';
    }
    return '';
  };

  // Validación de la descripción
  const validarDescripcion = (texto: string) => {
    if (texto.length > 50) {
      return 'La descripción no puede superar los 50 caracteres';
    }
    return '';
  };

  // Validación de filtros obligatorios
  const validarFiltros = () => {
    if (!corteSeleccionado || !metodoSeleccionado || !tiempoSeleccionado) {
      return 'Todos los filtros son obligatorios: Tipo de carne, Método de cocción y Tiempo';
    }
    return '';
  };

  const handleNombreChange = (texto: string) => {
    setNombre(texto);
    const error = validarNombre(texto);
    setErrores(prev => ({ ...prev, nombre: error }));
  };

  const handleDescripcionChange = (texto: string) => {
    if (texto.length <= 50) {
      setDescripcion(texto);
    }
    const error = validarDescripcion(texto);
    setErrores(prev => ({ ...prev, descripcion: error }));
  };

  const handleAddIngrediente = () => {
    if (nuevoIngrediente.trim()) {
      setIngredientes([...ingredientes, nuevoIngrediente.trim()]);
      setNuevoIngrediente('');
    }
  };

  const handleRemoveIngrediente = (index: number) => {
    const updated = [...ingredientes];
    updated.splice(index, 1);
    setIngredientes(updated);
  };

  // Nuevas funciones para manejar los pasos de preparación
  const handleAddPaso = () => {
    if (nuevoPaso.trim()) {
      setPasos([...pasos, nuevoPaso.trim()]);
      setNuevoPaso('');
    }
  };

  const handleRemovePaso = (index: number) => {
    const updated = [...pasos];
    updated.splice(index, 1);
    setPasos(updated);
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
      { id: 'paleta', nombre: 'Paleta' },
      { id: 'cuadril', nombre: 'Cuadril' },
    ];
    const cortesCerdo = [
      { id: 'chuleta', nombre: 'Chuleta' },
      { id: 'lomo-cerdo', nombre: 'Lomo' },
      { id: 'panceta', nombre: 'Panceta' },
      { id: 'costillar', nombre: 'Costillar' },
      { id: 'paleta-cerdo', nombre: 'Paleta' },
      { id: 'pierna', nombre: 'Pierna' },
    ];
    const cortesPollo = [
      { id: 'pechuga', nombre: 'Pechuga' },
      { id: 'muslo', nombre: 'Muslo' },
      { id: 'contramuslo', nombre: 'Contramuslo' },
      { id: 'ala', nombre: 'Ala' },
      { id: 'encuentro', nombre: 'Encuentro' },
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

  const getTiempoValor = () => {
    const tiemposPreparacion = [
      { id: 'rapido', nombre: 'Rápido (< 30 min)', valor: 20 },
      { id: 'medio', nombre: 'Medio (30-60 min)', valor: 45 },
      { id: 'largo', nombre: 'Largo (> 60 min)', valor: 90 },
    ];
    return tiemposPreparacion.find(t => t.id === tiempoSeleccionado)?.valor;
  };

  // Validación antes de avanzar al siguiente paso
  const validarYAvanzar = (siguientePaso: number) => {
    if (siguientePaso === 2) {
      // Validar paso 1
      const errorNombre = validarNombre(nombre);
      const errorDescripcion = validarDescripcion(descripcion);
      
      if (errorNombre || errorDescripcion) {
        setErrores(prev => ({
          ...prev,
          nombre: errorNombre,
          descripcion: errorDescripcion,
        }));
        return;
      }
    } else if (siguientePaso === 3) {
      // Validar paso 2 (filtros)
      const errorFiltros = validarFiltros();
      if (errorFiltros) {
        setErrores(prev => ({ ...prev, filtros: errorFiltros }));
        Alert.alert('Campos obligatorios', errorFiltros);
        return;
      }
      setErrores(prev => ({ ...prev, filtros: '' }));
    }
    
    setStep(siguientePaso);
  };

  const handleSubmit = async () => {
    // Validaciones finales
    const errorNombre = validarNombre(nombre);
    const errorDescripcion = validarDescripcion(descripcion);
    const errorFiltros = validarFiltros();

    if (errorNombre || errorDescripcion || errorFiltros) {
      Alert.alert('Error de validación', 'Por favor corrige los errores antes de continuar');
      return;
    }

    if (ingredientes.length === 0 || pasos.length === 0) {
      Alert.alert('Campos obligatorios', 'Por favor completa los ingredientes y pasos de preparación');
      return;
    }

    setLoading(true);

    const payload = {
      usuario_id: user?.id,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      ingredientes: ingredientes.join(', '),
      paso_a_paso: pasos.join(' | '), // Unir pasos con separador
      metodo_coccion: getNombreMetodo() || '',
      tipo_corte: getNombreCorte() || '',
      tiempo_preparacion: getTiempoValor() || null,
      foto_url: fotoUrl || null,
    };

    try {
      const response = await fetch('http://127.0.0.1:3000/recetas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        recetasEvents.emit('recetaCreada');
        
        // Reset form
        setStep(1);
        setNombre('');
        setDescripcion('');
        setIngredientes([]);
        setPasos([]);
        setCorteSeleccionado(null);
        setMetodoSeleccionado(null);
        setTiempoSeleccionado(null);
        setAnimalActual('vaca');
        setFoto(null);
        setFotoUrl(null);
        setErrores({ nombre: '', descripcion: '', filtros: '' });
        
        Alert.alert('¡Éxito!', '¡Receta creada exitosamente!');
      } else {
        Alert.alert('Error', data.error || 'No se pudo guardar la receta');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si se puede avanzar al siguiente paso
  const puedeAvanzarPaso1 = !errores.nombre && !errores.descripcion && nombre.trim().length >= 4;
  const puedeAvanzarPaso2 = corteSeleccionado && metodoSeleccionado && tiempoSeleccionado;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.stepText}>Paso {step} de 4</Text>

        {step === 1 && (
          <>
            <Text style={styles.title}>Información básica</Text>

            <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage} disabled={uploadingImage}>
              {uploadingImage ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color="#C41E3A" />
                  <Text style={styles.uploadingText}>Subiendo imagen...</Text>
                </View>
              ) : foto ? (
                <Image source={{ uri: foto }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imageTextContainer}>
                  <Text style={styles.imageIcon}>📸</Text>
                  <Text style={styles.imageText}>Agregar foto</Text>
                  <Text style={styles.imageSubtext}>Toca para seleccionar</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Nombre de la receta *</Text>
            <TextInput
              style={[styles.input, errores.nombre && styles.inputError]}
              placeholder="Ej: Bife de Chorizo a la Parrilla"
              value={nombre}
              onChangeText={handleNombreChange}
            />
            {errores.nombre ? <Text style={styles.errorText}>{errores.nombre}</Text> : null}

            <Text style={styles.label}>Descripción (máx. 50 caracteres)</Text>
            <TextInput
              style={[styles.input, styles.textArea, errores.descripcion && styles.inputError]}
              placeholder="Breve descripción de la receta"
              value={descripcion}
              onChangeText={handleDescripcionChange}
              multiline
              numberOfLines={3}
              maxLength={50}
            />
            <Text style={styles.characterCount}>{descripcion.length}/50</Text>
            {errores.descripcion ? <Text style={styles.errorText}>{errores.descripcion}</Text> : null}

            <TouchableOpacity 
              style={[styles.button, !puedeAvanzarPaso1 && styles.buttonDisabled]} 
              onPress={() => validarYAvanzar(2)}
              disabled={!puedeAvanzarPaso1}
            >
              <Text style={styles.buttonText}>Siguiente ➜</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Características de tu receta *</Text>
            <Text style={styles.subtitle}>Todos los filtros son obligatorios</Text>

            {/* Navegación de filtros igual que en search */}
            <View style={styles.filtroNav}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => cambiarFiltro('prev')}
              >
                <Ionicons name="chevron-back" size={28} color="#C41E3A" />
              </TouchableOpacity>

              <View style={styles.filtroIndicator}>
                <Text style={styles.filtroIndicatorText}>
                  {filtroActual === 'corte' ? 'Tipo de Carne *' : 
                   filtroActual === 'metodo' ? 'Método de Cocción *' : 
                   'Tiempo de Preparación *'}
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

            {/* Características seleccionadas */}
            {(corteSeleccionado || metodoSeleccionado || tiempoSeleccionado) && (
              <View style={styles.caracteristicasSeleccionadas}>
                <Text style={styles.caracteristicasTitle}>Características seleccionadas:</Text>
                <View style={styles.caracteristicasChips}>
                  {corteSeleccionado && (
                    <View style={styles.chipSeleccionado}>
                      <Text style={styles.chipSeleccionadoText}>
                        {getNombreCorte()}
                      </Text>
                      <TouchableOpacity onPress={() => setCorteSeleccionado(null)}>
                        <Ionicons name="close-circle" size={18} color="#C41E3A" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {metodoSeleccionado && (
                    <View style={styles.chipSeleccionado}>
                      <Text style={styles.chipSeleccionadoText}>
                        {getNombreMetodo()}
                      </Text>
                      <TouchableOpacity onPress={() => setMetodoSeleccionado(null)}>
                        <Ionicons name="close-circle" size={18} color="#C41E3A" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {tiempoSeleccionado && (
                    <View style={styles.chipSeleccionado}>
                      <Text style={styles.chipSeleccionadoText}>
                        {tiempoSeleccionado === 'rapido' ? 'Rápido (< 30 min)' : 
                         tiempoSeleccionado === 'medio' ? 'Medio (30-60 min)' : 
                         'Largo (> 60 min)'}
                      </Text>
                      <TouchableOpacity onPress={() => setTiempoSeleccionado(null)}>
                        <Ionicons name="close-circle" size={18} color="#C41E3A" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.button, !puedeAvanzarPaso2 && styles.buttonDisabled]} 
              onPress={() => validarYAvanzar(3)}
              disabled={!puedeAvanzarPaso2}
            >
              <Text style={styles.buttonText}>Siguiente ➜</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
              <Text style={styles.backText}>⬅ Volver</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Ingredientes *</Text>

            <View style={styles.ingredienteRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Ej: 500 g de carne"
                value={nuevoIngrediente}
                onChangeText={setNuevoIngrediente}
                onSubmitEditing={handleAddIngrediente}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddIngrediente}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {ingredientes.length === 0 && (
              <Text style={styles.emptyText}>Agrega al menos un ingrediente</Text>
            )}

            {ingredientes.map((ing, index) => (
              <View key={index} style={styles.ingredienteItem}>
                <Text style={styles.ingredienteText}>• {ing}</Text>
                <TouchableOpacity onPress={() => handleRemoveIngrediente(index)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity 
              style={[styles.button, ingredientes.length === 0 && styles.buttonDisabled]} 
              onPress={() => setStep(4)}
              disabled={ingredientes.length === 0}
            >
              <Text style={styles.buttonText}>Siguiente ➜</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
              <Text style={styles.backText}>⬅ Volver</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>Preparación *</Text>

            <View style={styles.ingredienteRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Ej: Calentar la parrilla a fuego medio"
                value={nuevoPaso}
                onChangeText={setNuevoPaso}
                onSubmitEditing={handleAddPaso}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddPaso}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {pasos.length === 0 && (
              <Text style={styles.emptyText}>Agrega al menos un paso de preparación</Text>
            )}

            {pasos.map((paso, index) => (
              <View key={index} style={styles.ingredienteItem}>
                <Text style={styles.ingredienteText}>{index + 1}. {paso}</Text>
                <TouchableOpacity onPress={() => handleRemovePaso(index)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.button, (loading || pasos.length === 0) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading || pasos.length === 0}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Publicar Receta 📤</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep(3)}>
              <Text style={styles.backText}>⬅ Volver</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  content: { 
    padding: 20, 
    paddingBottom: 50 
  },
  stepText: {
    textAlign: 'center',
    color: '#C41E3A',
    fontWeight: '600',
    marginBottom: 16,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  label: { 
    fontSize: 16, 
    color: '#1a1a1a', 
    marginTop: 16, 
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  textArea: { 
    minHeight: 100, 
    textAlignVertical: 'top' 
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  largeTextArea: {
    minHeight: 150,
  },
  button: {
    backgroundColor: '#C41E3A',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: { 
    opacity: 0.5 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 16 
  },
  imagePicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  imageTextContainer: {
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imageText: { 
    color: '#C41E3A', 
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  imageSubtext: {
    color: '#999',
    fontSize: 14,
  },
  imagePreview: { 
    width: '100%', 
    height: 220,
  },
  uploadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  uploadingText: {
    color: '#C41E3A',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para los filtros (igual que search.tsx)
  filtroNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  caracteristicasSeleccionadas: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  caracteristicasTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  caracteristicasChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipSeleccionado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  chipSeleccionadoText: {
    fontSize: 14,
    color: '#C41E3A',
    fontWeight: '600',
  },
  ingredienteRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#C41E3A',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { 
    color: '#FFFFFF', 
    fontSize: 24, 
    fontWeight: '700' 
  },
  ingredienteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ingredienteText: { 
    fontSize: 16, 
    color: '#1a1a1a',
    flex: 1,
  },
  removeText: { 
    color: '#C41E3A', 
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
  backButton: { 
    marginTop: 16, 
    alignItems: 'center',
    padding: 12,
  },
  backText: { 
    color: '#C41E3A', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});