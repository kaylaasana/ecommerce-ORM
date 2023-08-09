const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll({
      // be sure to include its associated Products
      include: [{ model: Product }],
    });
    if (!categoryData){
      res.status(404).json({message: "no category found"});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      // be sure to include its associated Products
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).json({ message: 'no products found with that id' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body)
    res.status(200).json(newCategory)
  } catch (err){
    res.status(500).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
  .then((product) => {
    if (req.body.id && req.body.id.length) {
      
      Product.findAll({
        where: { product_id: req.params.id }
      }).then((product) => {

        const productIds = product.map(({ id }) => id);
        const newProduct = req.body.id
        .filter((id) => !productIds.includes(id))
        .map((id) => {
          return {
            product_id: req.params.id,
            id,
          };
        });

          // figure out which ones to remove
        const productsToRemove = product
        .filter(({ id }) => !req.body.id.includes(id))
        .map(({ id }) => id);
                // run both actions
        return Promise.all([
          Product.destroy({ where: { id: productsToRemove } }),
          Product.bulkCreate(newProduct),
        ]);
      });
    }

    return res.json(product);
  })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: 'no products found with that id' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
