const clienteModel = require('../models/cliente.model');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALT_ROUNDS);

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const clientes = await clienteModel.find({deleted: false}).limit(limit).skip(offset).sort({[sort]: order});

        let response = {
            message: "clientes obtenidos exitosamente",
            data: clientes
        };

        if (page && limit) {
            const totalClientes = await clienteModel.countDocuments({deleted: false});
            response = {
                ...response,
                total: totalClientes,
                totalPages: Math.ceil(totalClientes / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los clientes",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const cliente = await clienteModel.findById(idCliente);

        if (!cliente) {
            return res.status(404).json({
                message: `no se encontró el cliente con id ${idCliente}`
            });
        }

        return res.status(200).json({
            message: "cliente encontrado exitosamente",
            cliente
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el cliente",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const {nombre, apellido, correo, contrasena} = req.body;
        const hashedPassword = bcrypt.hashSync(contrasena, saltosBcrypt);

        const cliente = new clienteModel({
            nombre,
            apellido,
            correo,
            contrasena: hashedPassword
        });

        await cliente.save();

        return res.status(201).json({
            message: "cliente creado exitosamente",
            cliente
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el cliente",
            error: error.message
        });
    }
}

const deleteById = async (req, res) => {
    try {
        const idCliente = req.params.id;

        await clienteModel.findByIdAndUpdate(idCliente, {deleted: true});

        return res.status(200).json({
            message: "se eliminó el cliente correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el cliente",
            error: error.message
        });
    }
}

const updateById = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const {nombre, apellido, correo, contrasena} = req.body;
        const hashedPassword = bcrypt.hashSync(contrasena, saltosBcrypt);

        await clienteModel.findByIdAndUpdate(idCliente, {
            nombre,
            apellido,
            correo,
            contrasena: hashedPassword
        });

        return res.status(200).json({
            message: "cliente actualizado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el cliente",
            error: error.message
        });
    }
}

const putById = async (req, res) => {
    try {
        const idCliente = req.params.id;
        const {nombre, apellido, correo, contrasena} = req.body;
        const hashedPassword = bcrypt.hashSync(contrasena, saltosBcrypt);

        await clienteModel.findByIdAndUpdate(idCliente, {
            nombre: nombre || null,
            apellido: apellido || null,
            correo: correo || null,
            contrasena: hashedPassword || null
        });

        return res.status(200).json({
            message: "cliente actualizado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el cliente",
            error: error.message
        });
    }
}

module.exports = {
    index,
    getById,
    create,
    deleteById,
    updateById,
    putById
}
