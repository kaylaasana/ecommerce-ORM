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

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((category) => {
      if (req.body.id.length) {
        const categoryIdArr = req.body.id.map((category_id) => {
          return {
            category_id: category_id,
          };
        });
        return Category.bulkCreate(categoryIdArr);
      }
      res.status(200).json(category);
    })
    .then((categoryID) => res.status(200).json(categoryID))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      if (req.body.id && req.body.id.length) {
        
        Category.findAll({
          where: { category_id: req.params.id }
        }).then((categoryParam) => {
          const categoryId = categoryParam.map(({ category_id }) => category_id);
          const newcategoryId = req.body.id
          .filter((category_id) => !categoryId.includes(category_id))
          .map((category_id) => {
            return {
              product_id: req.params.id,
              category_id,
            };
          });
          const categoriesToRemove = categoryParam
          .filter(({ category_id }) => !req.body.id.includes(category_id))
          .map(({ id }) => id);
          return Promise.all([
            Category.destroy({ where: { id: categoriesToRemove } }),
            Category.bulkCreate(newcategoryId),
          ]);
        });
      }
      return res.json(category);
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
