const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const db = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});

db.connect((err) => {
    if (err)
        throw err;
    console.log('MySql connected')
});

const app = express();

app.use(bodyParser.json()); //for all
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/categories', function (req, res) {
    db.query('SELECT * FROM categories', function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Categories'
        });
    });
});

app.get('/products', function (req, res) {
    db.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Products'
        });
    });
});

app.get('/product/:id', function (req, res) {
    let product_id = req.params.id;

    if (!product_id) {
        return res.status(400).send({
            error: true,
            message: 'Please provide product_id'
        });
    }

    db.query('SELECT * FROM products where id=?', product_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results[0],
            message: 'Product'
        });
    });
});


app.get('/products/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;

    db.query('SELECT * FROM products WHERE name LIKE ? ', ['%' + keyword + '%'], function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Products search list'
        });
    });
});

app.post('/product', function (req, res) {
    let name = req.body.name;

    if (!name) {
        return res.status(400).send({
            error: true,
            message: 'Please provide product'
        });
    }

    db.query('INSERT INTO products SET ?', {name: name}, function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'New product created'
        });

    })
})

app.delete('/product', function (req, res) {

    let product_id = req.body.id;

    if (!product_id) {
        return res.status(400).send({
            error: true,
            message: 'Please provide product_id'
        });
    }
    db.query('DELETE FROM products WHERE id = ?', [product_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Product deleted'
        });
    });
});

app.put('/product', function (req, res) {
    let product_id = req.body.id;
    let product = req.body.name;

    if (!product_id || product) {
        return res.status(400).send({
            error: true,
            message: 'Please provide product_id and product'
        });
    }

    db.query('UPDATE products SET name= ? WHERE id = ?', [product, product_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Product has been updated'
        });
    });
});


app.listen('8080', () => {
    console.log('Server started on port 8080')
});

module.exports = app;