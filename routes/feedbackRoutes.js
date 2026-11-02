const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST
router.post("/", async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();

        res.status(201).json(feedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const feedback = await Feedback.find()
            .skip(skip)
            .limit(limit);

        const total = await Feedback.countDocuments();

        res.json({
            page,
            total,
            feedback
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH
router.patch("/:id", async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.json(feedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;