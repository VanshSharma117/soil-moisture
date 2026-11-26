

const readingSchema = new mongoose.Schema({
deviceId: { type: String, required: true },
timestamp: { type: Date, default: Date.now },
moisture: { type: Number, required: true },
temperature: { type: Number },
ec: { type: Number },
battery: { type: Number }
});


module.exports = mongoose.model('Reading', readingSchema);