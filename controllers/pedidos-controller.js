const mysql = require('../mysql').pool;


exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })};
        conn.query( `SELECT  PEDIDOS.id_pedido,
                             PEDIDOS.quantidade,
                             produtos.id_produtos,
                             produtos.nome,
                             produtos.preco
                       FROM  PEDIDOS
                 INNER JOIN  produtos
                         ON  produtos.id_produtos = PEDIDOS.id_produtos;`,
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error:error })};
                const response = {
                    PEDIDOS: result.map(PEDIDOS => {
                        return {
                            id_pedido: PEDIDOS.id_pedido,
                            quantidade: PEDIDOS.quantidade,
                            produto: {
                                id_produtos: PEDIDOS.id_produtos,
                                nome: PEDIDOS.nome,
                                preco: PEDIDOS.preco
                            },
                            request: {
                                tipo: 'GET',
                                descrição: 'Retorna os detalhes de um pedido específico.',
                                url: 'http://localhost:3000/pedidos/' + PEDIDOS.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    })
};

exports.postPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })};

        conn.query('SELECT * FROM produtos WHERE id_produtos = ?', [req.body.id_produtos], (error, result, field) => {
            if(error) {
                return res.status(500).send({
                    error: error,                  
                });
            }

            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Produto não encontrado.'
                })
            }

            conn.query(
                'INSERT INTO PEDIDOS (id_produtos, quantidade) VALUES (?, ?)',
                [req.body.id_produtos, req.body.quantidade],
                (error, result, field) => {
                    conn.release();
    
                    if(error) {
                        return res.status(500).send({
                            error: error,
                            response: null                    
                        });
                    }
    
                    const response = {
                        mensagem: 'Pedido inserido com sucesso',
                        pedidoCriado: {
                            id_pedido: result.id_pedido,
                            id_produtos: req.body.id_produtos,
                            quantidade: req.body.quantidade,
                            request: {
                                tipo: 'GET',
                                descrição: 'Retorna todos os pedidos.',
                                url: 'http://localhost:3000/pedidos'
                            }
                        }
                    }
    
                    return res.status(201).send(response);
                }
            )

        })
    });
};


exports.getUmPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })};
        conn.query(
            'SELECT * FROM PEDIDOS WHERE id_pedido = ?;',
            [req.params.id_pedido],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error:error })};
                
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com este ID'
                    })
                }
                
                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produtos: result[0].id_produtos,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descrição: 'Retorna todos os pedidos.',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    })
    
};

exports.deletePedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })};
        conn.query(
            'DELETE FROM PEDIDOS WHERE id_pedido = ?', [req.body.id_pedido],
            (error, resultado, field) => {
                conn.release();

                if(error) {
                    return res.status(500).send({
                        error: error,                    
                    });
                }

                const response = {
                    mensagem: 'Pedido removido com sucesso.',
                    request: {
                        tipo: 'POST',
                        descrição: 'Insere um pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: {
                            id_produtos: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }

                res.status(202).send({response});
            }
        )
    });
};