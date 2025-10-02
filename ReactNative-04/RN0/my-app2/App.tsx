import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    SectionList,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    VirtualizedList,
} from 'react-native';

export default function ComponentsTab() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dataFlatList = ['Elemento 1', 'Elemento 2', 'Elemento 3'];
  const dataSectionList = [
    { title: 'Frutas', data: ['Manzana', 'Banana', 'Naranja'] },
    { title: 'Verduras', data: ['Lechuga', 'Tomate', 'Zanahoria'] },
  ];

  const virtualizedData = Array.from({ length: 20 }, (_, i) => ({ id: i, text: `Item ${i + 1}` }));

  const screen = Dimensions.get('window');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView 
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.title}>📱 Todos los Componentes de React Native</Text>

          {/* 1. View */}
          <Text style={styles.subtitle}>1. View</Text>
          <View style={styles.box}>
            <Text>View: contenedor para agrupar elementos y definir layouts.</Text>
          </View>

          {/* 2. Text */}
          <Text style={styles.subtitle}>2. Text</Text>
          <Text>Text: mostrar texto en pantalla.</Text>

          {/* 3. Button */}
          <Text style={styles.subtitle}>3. Button</Text>
          <Button title="Botón de ejemplo" onPress={() => Alert.alert('Botón presionado')} />

          {/* 4. TextInput */}
          <Text style={styles.subtitle}>4. TextInput</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe aquí"
            value={text}
            onChangeText={setText}
          />
          <Text>Texto escrito: {text}</Text>

          {/* 5. Image */}
          <Text style={styles.subtitle}>5. Image</Text>
          <Image
            style={styles.image}
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          />

          {/* 6. ImageBackground */}
          <Text style={styles.subtitle}>6. ImageBackground</Text>
          <ImageBackground
            style={styles.imageBackground}
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          >
            <Text style={styles.overlayText}>Texto sobre imagen</Text>
          </ImageBackground>

          {/* 7. Switch */}
          <Text style={styles.subtitle}>7. Switch</Text>
          <Switch value={isEnabled} onValueChange={setIsEnabled} />
          <Text>{isEnabled ? 'Activado' : 'Desactivado'}</Text>

          {/* 8. ActivityIndicator */}
          <Text style={styles.subtitle}>8. ActivityIndicator</Text>
          <View style={styles.box}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Cargando...</Text>
          </View>

          {/* 9. Pressable */}
          <Text style={styles.subtitle}>9. Pressable</Text>
          <Pressable onPress={() => Alert.alert('Presionaste Pressable')}>
            <Text style={{ color: 'blue' }}>Tócame (Pressable)</Text>
          </Pressable>

          {/* 10. TouchableOpacity */}
          <Text style={styles.subtitle}>10. TouchableOpacity</Text>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => Alert.alert('Presionaste TouchableOpacity')}
          >
            <Text style={{ color: 'white' }}>Tócame</Text>
          </TouchableOpacity>

          {/* 11. TouchableHighlight */}
          <Text style={styles.subtitle}>11. TouchableHighlight</Text>
          <TouchableHighlight
            style={styles.touchableHighlight}
            onPress={() => Alert.alert('Presionaste TouchableHighlight')}
            underlayColor="#ffa"
          >
            <Text>Tócame</Text>
          </TouchableHighlight>

          {/* 12. TouchableWithoutFeedback */}
          <Text style={styles.subtitle}>12. TouchableWithoutFeedback</Text>
          <TouchableWithoutFeedback onPress={() => Alert.alert('Sin feedback visual')}>
            <View style={styles.box}>
              <Text>Tócame (sin efecto visual)</Text>
            </View>
          </TouchableWithoutFeedback>

          {/* 13. FlatList */}
          <Text style={styles.subtitle}>13. FlatList</Text>
          <FlatList
            data={dataFlatList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>- {item}</Text>}
          />

          {/* 14. SectionList */}
          <Text style={styles.subtitle}>14. SectionList</Text>
          <SectionList
            sections={dataSectionList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>• {item}</Text>}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>{title}</Text>
            )}
          />

          {/* 15. VirtualizedList */}
          <Text style={styles.subtitle}>15. VirtualizedList</Text>
          <View style={{ height: 150, backgroundColor: '#f9f9f9', marginVertical: 10 }}>
            <VirtualizedList
              data={virtualizedData}
              getItem={(data, index) => data[index]}
              getItemCount={(data) => data.length}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Text style={{ padding: 5 }}>- {item.text}</Text>
              )}
            />
          </View>

          {/* 16. RefreshControl */}
          <Text style={styles.subtitle}>16. RefreshControl</Text>
          <View style={styles.box}>
            <Text>Desliza hacia abajo en el ScrollView para refrescar (ya integrado arriba)</Text>
            <Text>{refreshing ? '🔄 Refrescando...' : '✓ Listo'}</Text>
          </View>

          {/* 17. Modal */}
          <Text style={styles.subtitle}>17. Modal</Text>
          <Button title="Abrir Modal" onPress={() => setModalVisible(true)} />
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>¡Hola, soy un modal!</Text>
                <Button title="Cerrar" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>

          {/* 18. Dimensions */}
          <Text style={styles.subtitle}>18. Dimensions</Text>
          <View style={styles.box}>
            <Text>Ancho: {screen.width.toFixed(0)}px</Text>
            <Text>Alto: {screen.height.toFixed(0)}px</Text>
          </View>

          {/* 19. KeyboardAvoidingView */}
          <Text style={styles.subtitle}>19. KeyboardAvoidingView</Text>
          <View style={styles.box}>
            <Text>Ejemplo con TextInput que evita que el teclado tape el input:</Text>
            <TextInput style={styles.input} placeholder="Escribe algo..." />
          </View>

          {/* 20. SafeAreaView */}
          <Text style={styles.subtitle}>20. SafeAreaView</Text>
          <View style={{ backgroundColor: 'pink', padding: 10, marginVertical: 5 }}>
            <Text>SafeAreaView respeta zonas seguras (notch, barra superior)</Text>
          </View>

          {/* 21. StatusBar */}
          <Text style={styles.subtitle}>21. StatusBar</Text>
          <View style={{ backgroundColor: '#6200ee', padding: 10, marginVertical: 5 }}>
            <Text style={{ color: 'white' }}>Barra de estado personalizada con StatusBar</Text>
          </View>

          {/* 22. ScrollView */}
          <Text style={styles.subtitle}>22. ScrollView</Text>
          <View style={styles.box}>
            <Text>ScrollView envuelve toda esta pantalla para hacerla desplazable</Text>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
    color: '#6200ee',
  },
  box: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  image: {
    width: 80,
    height: 80,
    marginVertical: 10,
  },
  imageBackground: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  overlayText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 5,
  },
  touchable: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  touchableHighlight: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
});