import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Carrega variáveis do .env
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TEST
      : process.env.MONGO_URI;

    if (!uri) {
      throw new Error("Variável de ambiente MONGO_URI ou MONGO_URI_TEST não definida");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado!");
  } catch (err) {
    console.error("Erro ao conectar no MongoDB:", err.message);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

export default connectDB;
