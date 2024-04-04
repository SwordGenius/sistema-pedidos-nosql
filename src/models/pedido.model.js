const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    tipo_pedido: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    fecha_pedido: {
        type: Date,
        default: Date.now
    },
    ubicacion_entrega: {
        type: String,
        required: true
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

module.exports = mongoose.model('Pedido', pedidoSchema);