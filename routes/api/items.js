const { request } = require("express");
const express = require("express");
const router = express.Router();

// Item model
const Item = require("../../models/Item");

// @route   GET api/items
// @desc    Get all items
router.get("/", (req, res) => {
    let pipeline = [
        {
            $sort: { name: 1 }
        },
        {  $group: 
            {   _id: "$category", 
                items: { $push: { name: "$name", id: "$_id", category: "$category", count: "$count", found: "$found" } }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ];
    Item.aggregate(pipeline)
        .then(items => res.json(items));
});

// @route   POST api/items/update
// @desc    Update an item
router.post("/update", (req, res) => {
    Item.findOneAndUpdate({ _id: req.body.id }, {$inc : {count : req.body.count }}, { new: true }, (err, updatedItem) => {
        if (err) return res.status(404).json({itemUpdated: false});
        res.json(updatedItem)
    });
});

// @route   DELETE api/items/delete
// @desc    Delete an item
router.delete("/delete", (req, res) => {
    Item.findById(req.body.id)
        .then(item => item.remove()
            .then(() => res.json(req.body))
        )
        .catch(err => res.status(404).json({itemDeleted: false}));
})

// @route   POST api/items/add
// @desc    Add an item
router.post("/add", (req, res) => {
    const item = new Item({name: req.body.name, category: req.body.category, count: req.body.count});
    item.save((err, savedItem) => {
    if (err) return res.status(404).json({itemAdded: false});
    res.json(savedItem)
  });
});

// @route   POST api/items/found
// @desc    Toggle whether item found
router.post("/found", (req, res) => {
    Item.findOneAndUpdate({ _id: req.body.id }, {found : !req.body.found }, { new: true }, (err, updatedItem) => {
        if (err) return res.status(404).json({itemFound: false});
        res.json(updatedItem)
    });
});

// @route   GET api/items/foundreset
// @desc    Set all found to false for all items
router.get("/foundreset", (req, res) => {
    Item.updateMany({ found: true }, { found : false }, (err, item) => {
        if (err) return res.status(404).json({foundReset: false});
        res.json(item)
    });
});

module.exports = router;