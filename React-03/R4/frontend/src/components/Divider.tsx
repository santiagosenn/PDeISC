function Divider() {
  return (
    <div style={{
      width: '80%',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, #007bff, transparent)',
      margin: '80px auto',
      borderRadius: '2px',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '12px',
        height: '12px',
        backgroundColor: '#007bff',
        borderRadius: '50%',
        boxShadow: '0 0 20px rgba(0,123,255,0.5)'
      }}></div>
    </div>
  );
}