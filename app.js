const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir que Express lea datos en formato JSON 
app.use(express.json());

// Datos simulados en memoria
let productos = [
    { id: 1, nombre: 'Teclado Mecánico', precio: 45000, categoria: 'perifericos' },
    { id: 2, nombre: 'Mouse Gamer', precio: 25000, categoria: 'perifericos' },
    { id: 3, nombre: 'Monitor 24"', precio: 120000, categoria: 'monitores' }
];

/// 1. api/productos?categoria=....
app.get('/api/productos', (req, res) => {
    const { categoria } = req.query; 

    if (categoria) {
        const filtrados = productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
        return res.status(200).json({
            ok: true,
            message: `Productos de la categoría: ${categoria}`,
            data: filtrados
        });
    }

    // Si no viene query, devuelve todos los productos
    res.status(200).json({
        ok: true,
        message: 'Lista de todos los productos',
        data: productos
    });
});

// 2.get /api/productos/:id
app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id); // req.params lee la ruta dinámica (:id)
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({
            ok: false,
            message: `Producto con ID ${id} no encontrado`,
            errors: ['El ID buscado no existe en la base de datos.']
        });
    }

    res.status(200).json({
        ok: true,
        message: 'Producto encontrado con éxito',
        data: producto
    });
});

// 3.post /api/productos
app.post('/api/productos', (req, res) => {
    const { nombre, precio, categoria } = req.body; 

    if (!nombre || precio === undefined) {
        return res.status(400).json({
            ok: false,
            message: 'Error de validación',
            errors: ['El nombre y el precio son obligatorios.']
        });
    }

    if (typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({
            ok: false,
            message: 'Error de validación',
            errors: ['El precio debe ser un número mayor que 0.']
        });
    }

    // Crear el nuevo producto asignándole un ID único
    const nuevoProducto = {
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
        nombre,
        precio,
        categoria: categoria || 'general'
    };

    productos.push(nuevoProducto);

    res.status(201).json({
        ok: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto
    });
});

// desafio: PUT /api/productos/:id 
app.put('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, precio, categoria } = req.body;
    
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            ok: false,
            message: 'Producto no encontrado',
            errors: [`No se puede actualizar el producto con ID ${id} porque no existe.`]
        });
    }

    // Validar si envían precio que sea válido
    if (precio !== undefined && (typeof precio !== 'number' || precio <= 0)) {
        return res.status(400).json({
            ok: false,
            message: 'Error de validación',
            errors: ['El precio debe ser un número mayor que 0.']
        });
    }

    // Actualizar campos si vienen en el body
    if (nombre) productos[index].nombre = nombre;
    if (precio) productos[index].precio = precio;
    if (categoria) productos[index].categoria = categoria;

    res.status(200).json({
        ok: true,
        message: 'Producto actualizado correctamente',
        data: productos[index]
    });
});

// desafio DELETE /api/productos/:id 
app.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            ok: false,
            message: 'Producto no encontrado',
            errors: [`No se puede eliminar el producto con ID ${id} porque no existe.`]
        });
    }

    const productoEliminado = productos.splice(index, 1);

    res.status(200).json({
        ok: true,
        message: 'Producto eliminado correctamente',
        data: productoEliminado[0]
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});