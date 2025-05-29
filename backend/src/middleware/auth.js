const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Headers recibidos:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token extraído:', token);
    
    if (!token) {
      console.log('No se encontró token');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Token decodificado:', decoded);

    const user = await User.findById(decoded.userId);
    console.log('Usuario encontrado:', user ? user.email : 'no encontrado');

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth; 