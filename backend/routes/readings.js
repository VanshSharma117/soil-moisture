const express = require('express');
const router = express.Router();
const Reading = require('../models/Reading');


// POST a new reading (from device)
router.post('/', async (req, res) => {
try {
const reading = new Reading(req.body);
await reading.save();
return res.status(201).json(reading);
} catch (err) {
return res.status(400).json({ error: err.message });
}
});


// GET latest N readings
router.get('/latest/:n', async (req, res) => {
const n = parseInt(req.params.n) || 50;
const deviceId = req.query.deviceId;
const filter = deviceId ? { deviceId } : {};
const readings = await Reading.find(filter).sort({ timestamp: -1 }).limit(n);
res.json(readings);
});


module.exports = router;