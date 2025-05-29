const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Obtener todas las conversaciones del usuario
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'username name avatar')
    .sort('-updatedAt');

    res.json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Error al obtener las conversaciones' });
  }
});

// Crear una nueva conversación
router.post('/conversations', auth, async (req, res) => {
  try {
    const { recipientId } = req.body;

    // Verificar que el destinatario existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si ya existe una conversación entre estos usuarios
    const existingConversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, recipientId]
      }
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    // Crear nueva conversación
    const conversation = new Conversation({
      participants: [req.user._id, recipientId]
    });

    await conversation.save();
    await conversation.populate('participants', 'username name avatar');

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Error al crear la conversación' });
  }
});

// Obtener mensajes de una conversación
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }

    const messages = await Message.find({
      conversation: req.params.conversationId
    })
    .populate('sender', 'username name avatar')
    .sort('createdAt');

    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error al obtener los mensajes' });
  }
});

// Enviar un mensaje
router.post('/:conversationId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }

    const message = new Message({
      conversation: conversation._id,
      sender: req.user._id,
      text
    });

    await message.save();
    await message.populate('sender', 'username name avatar');

    // Actualizar último mensaje de la conversación
    conversation.lastMessage = {
      text,
      sender: req.user._id,
      createdAt: message.createdAt
    };
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
});

module.exports = router; 