const pedidoModel = require('../models/pedido.model');
const clienteModel = require('../models/cliente.model');
const {verify} = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const pedidos = await pedidoModel.find({deleted: false})

        let response = {
            message: "pedidos obtenidos exitosamente",
            data: pedidos
        };

        if (page && limit) {
            const pedidos = await pedidoModel.find({deleted: false}).limit(limit).skip(offset).sort({[sort]: order})
            const totalPedidos = await pedidoModel.countDocuments();
            response = {
                ...response,
                data: pedidos,
                total: totalPedidos,
                totalPages: Math.ceil(totalPedidos / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los pedidos",
            error: error.message
        });
    }
}

const getById = async (req, res) => {
    try {
        const idPedido = req.params.id;
        const pedido = await pedidoModel.findById(idPedido);

        if (!pedido) {
            return res.status(404).json({
                message: `no se encontró el pedido con id ${idPedido}`
            });
        }

        return res.status(200).json({
            message: "pedido encontrado exitosamente",
            pedido
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el pedido",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const {tipo_pedido, cantidad, ubicacion_entrega} = req.body
        const token = req.cookies.aToken;
        const idCliente = verify(token, process.env.SECRET).cliente._id;
        const cliente = await clienteModel.findById(idCliente);
        const pedido = new pedidoModel({
            tipo_pedido,
            cantidad,
            ubicacion_entrega
        });
        await pedido.save();
        const newClient = new clienteModel(cliente)
        newClient.pedidos.push(pedido._id);
        await newClient.save();

        return res.status(200).json({
            message: "pedido creado exitosamente",
            pedido
        });

    }catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el pedido",
            error: error.message
        });
    }
}

const deleteById = async (req, res) => {
    try {
        const idPedido = req.params.id;
        await pedidoModel.findByIdAndUpdate(idPedido, {deleted: true});
        return res.status(200).json({
            message: "pedido eliminado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el pedido",
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