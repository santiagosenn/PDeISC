import mysql from "mysql2/promise";

export async function connectdb() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",        
      database: "usuarios"
    });
    console.log("✅ Conexión establecida con MySQL");
    return connection;
  } catch (err) {
    console.error("❌ Error de conexión:", err);
    return null;
  }
}
