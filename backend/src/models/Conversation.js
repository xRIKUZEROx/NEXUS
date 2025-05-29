const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastMessage: {
    text: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: Date
  }
}, {
  timestamps: true
});

// Asegurar que solo hay dos participantes por conversación
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('Una conversación debe tener exactamente 2 participantes'));
  } else {
    next();
  }
});

// Índice para buscar conversaciones por participantes
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema); 