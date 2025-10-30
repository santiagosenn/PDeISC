import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  const handleLogin = async () => {
    setError('');
    
    if (!nombre || !contraseña) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, contraseña }),
      });

      const data = await response.json();
      
      console.log('📥 Respuesta del login:', data);
      
      if (data.success) {
        console.log('👤 Guardando usuario:', data.user);
        setUser(data.user);
        
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 100);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (e) {
      console.error('Error:', e);
      setError('No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setError('');
    setSocialLoading(provider);

    try {
      const authUrl = `http://127.0.0.1:3000/auth/${provider}`;
      
      console.log(`🔐 Iniciando login con ${provider}...`);
      
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        'exp://localhost:8081/--/auth-callback'
      );

      console.log('📥 Resultado de OAuth:', result);

      if (result.type === 'success' && result.url) {
        // Extraer datos del usuario de la URL
        const url = new URL(result.url);
        const userParam = url.searchParams.get('user');
        
        if (userParam) {
          const userData = JSON.parse(decodeURIComponent(userParam));
          console.log('✅ Usuario autenticado con', provider, ':', userData);
          
          setUser(userData);
          
          setTimeout(() => {
            router.replace('/(tabs)/home');
          }, 100);
        } else {
          setError('Error al procesar la autenticación');
        }
      } else if (result.type === 'cancel') {
        console.log('❌ Usuario canceló la autenticación');
        setError('Autenticación cancelada');
      }
    } catch (e) {
      console.error(`❌ Error con ${provider}:`, e);
      setError(`No se pudo conectar con ${provider}`);
    } finally {
      setSocialLoading(null);
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
        <Text style={styles.subtitle}>Inicia sesión</Text>
        
        {/* Login tradicional */}
        <TextInput 
          placeholder="Nombre de usuario" 
          value={nombre} 
          onChangeText={(text) => {
            setNombre(text);
            setError('');
          }}
          style={styles.input}
          autoCapitalize="none"
          editable={!loading && !socialLoading}
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
          editable={!loading && !socialLoading}
        />
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        
        <TouchableOpacity 
          style={[styles.button, (loading || socialLoading) && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading || !!socialLoading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Text>
        </TouchableOpacity>

        {/* Divisor */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>o continúa con</Text>
          <View style={styles.divider} />
        </View>

        {/* Botones de redes sociales */}
        <View style={styles.socialButtonsContainer}>
          {/* Botón Google */}
          <TouchableOpacity 
            style={[
              styles.socialButton,
              styles.googleButton,
              socialLoading === 'google' && styles.socialButtonLoading
            ]}
            onPress={() => handleSocialLogin('google')}
            disabled={!!socialLoading || loading}
          >
            {socialLoading === 'google' ? (
              <ActivityIndicator size="small" color="#4285F4" />
            ) : (
              <>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.socialButtonText}>Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Botón Facebook */}
          <TouchableOpacity 
            style={[
              styles.socialButton,
              styles.facebookButton,
              socialLoading === 'facebook' && styles.socialButtonLoading
            ]}
            onPress={() => handleSocialLogin('facebook')}
            disabled={!!socialLoading || loading}
          >
            {socialLoading === 'facebook' ? (
              <ActivityIndicator size="small" color="#1877F2" />
            ) : (
              <>
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Registro */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>Regístrate</Text>
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999999',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  facebookButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  socialButtonLoading: {
    opacity: 0.6,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  registerText: {
    color: '#666666',
    fontSize: 16,
  },
  registerLink: {
    color: '#C41E3A',
    fontSize: 16,
    fontWeight: '600',
  },
});