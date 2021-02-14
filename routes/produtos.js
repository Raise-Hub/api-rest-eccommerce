const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login')

const ProdutosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true);
    }else {
        cb(null, false);
    }

}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get('/', ProdutosController.getProdutos); //LISTA OS PRODUTOS
router.post(
    '/', 
    login.obrigatorio, 
    upload.single('produto_imagem'),    //INSERE UM PRODUTO
    ProdutosController.postProdutos
);
router.get('/:id_produtos', ProdutosController.getUmProduto); //LISTA UM PRODUTO ESPECIFICO
router.patch('/', login.obrigatorio, ProdutosController.updateProduto); //ALTERA UM PRODUTO
router.delete('/', login.obrigatorio, ProdutosController.deleteProduto); //DELETA UM PRODUTO

module.exports = router;