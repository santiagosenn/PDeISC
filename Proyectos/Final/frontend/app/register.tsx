import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    
    if (!nombre || !contraseña || !confirmarContraseña) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (contraseña.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:3000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, contraseña }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Registro exitoso, volver al login
        router.replace('/');
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (e) {
      console.error('Error:', e);
      setError('No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🥩</Text>
        <Text style={styles.title}>ReCorte</Text>
        <Text style={styles.subtitle}>Crear cuenta</Text>
        
        <TextInput 
          placeholder="Nombre de usuario" 
          value={nombre} 
          onChangeText={(text) => {
            setNombre(text);
            setError('');
          }}
          style={styles.input}
          autoCapitalize="none"
          editable={!loading}
        />
        
        <TextInput 
          placeholder="Contraseña" 
          value={contraseña} 
          onChangeText={(text) => {
            setContraseña(text);
            setError('');
          }}
          style={styles.input} 
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput 
          placeholder="Confirmar contraseña" 
          value={confirmarContraseña} 
          onChangeText={(text) => {
            setConfirmarContraseña(text);
            setError('');
          }}
          style={styles.input} 
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 72,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 8,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    backgroundColor: '#F5F5F5',
    marginBottom: 16, 
    padding: 16, 
    borderRadius: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#C41E3A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#C41E3A',
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#666666',
    fontSize: 16,
  },
  loginLink: {
    color: '#C41E3A',
    fontSize: 16,
    fontWeight: '600',
  },
});