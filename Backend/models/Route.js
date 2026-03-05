import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: true,
    },
    // Top-level summary fields for better visibility in database tools
    totalDistance: { type: Number, default: 0 },
    totalStops: { type: Number, default: 0 },
    estimatedCost: { type: Number, default: 0 },
    estimatedTime: { type: Number, default: 0 },
    stops: {
        type: Array,
        default: [],
    },
    metrics: {
        type: Object,
        default: {},
    },
}, { timestamps: true });

const Route = mongoose.model('Route', routeSchema);

export default Route;
