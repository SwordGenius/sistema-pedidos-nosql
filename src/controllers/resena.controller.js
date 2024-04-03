const resenaModel = require('../models/resena.model');
const clienteModel = require('../models/cliente.model');
const {verify} = require("jsonwebtoken");


const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const resenas = await resenaModel.find({deleted: false})

        let response = {
            message: "reseñas obtenidos exitosamente",
            data: resenas
        };

        if (page && limit) {
            const resenas = await resenaModel.find({deleted: false}).limit(limit).skip(offset).sort({[sort]: order})
            const totalResenas = await resenaModel.countDocuments();
            response = {
                ...response,
                data: resenas,
                total: totalResenas,
                totalPages: Math.ceil(totalResenas / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los reseñas",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idResena = req.params.id;
        const resena = await resenaModel.findById(idResena);

        if (!resena) {
            return res.status(404).json({
                message: `no se encontró el resena con id ${idResena}`
            });
        }

        return res.status(200).json({
            message: "resena encontrado exitosamente",
            resena
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el resena",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const {comentario, nombre, calificacion } = req.body;
        const token = req.cookies.aToken;
        const idCliente = verify(token, process.env.SECRET).usuario._id;
        const cliente = await clienteModel.findById(idCliente);

        const newResena = new resenaModel({
            comentario,
            nombre,
            calificacion
        });

        await newResena.save();

        const newClient = new clienteModel(cliente)
        newClient.resenas.push(newResena._id);
        await newClient.save();

        return res.status(201).json({
            message: "resena creada exitosamente",
            resena: newResena
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear la resena",
            error: error.message
        });
    }
}

const deleteById = async (req, res) => {
    try {
        const idResena = req.params.id;

        await resenaModel.findByIdAndUpdate(idResena, {deleted: true});

        return res.status(200).json({
            message: "resena eliminada exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar la resena",
            error: error.message
        });
    }
}

module.exports = {
    index,
    getById,
    create,
    deleteById
}