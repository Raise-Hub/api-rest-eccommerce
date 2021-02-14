const express = require('express');
const router = express.Router();


const PedidosController = require('../controllers/pedidos-controller');


router.get('/', PedidosController.getPedidos); //LISTA OS PEDIDOS
router.post('/', PedidosController.postPedidos); //CRIA UM PEDIDO
router.get('/:id_pedido', PedidosController.getUmPedido); //LISTA UM PEDIDO ESPECIFICO
router.delete('/', PedidosController.deletePedidos); //DELETA UM PEDIDO

module.exports = router;