const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');

router.use('/categories', categoryRoutes);
// http://localhost:3001/api/categories/
router.use('/products', productRoutes);
// http://localhost:3001/api/products/
router.use('/tags', tagRoutes);
// http://localhost:3001/api/tags/

module.exports = router;
