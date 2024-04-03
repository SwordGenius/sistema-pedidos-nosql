const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
    calificacion: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    comentario: {
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

module.exports = mongoose.model('Resena', resenaSchema);