const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    contrasena: {
        type: String,
        required: true
    },
    pedidos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Pedido'
    },
    resenas: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Resena'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    deletedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Cliente', clienteSchema);