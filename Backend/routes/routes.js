import express from 'express';
import Route from '../models/Route.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/routes — get all saved routes for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const routes = await Route.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(routes);
    } catch (error) {
        console.error('Get routes error:', error);
        res.status(500).json({ message: 'Server error fetching routes' });
    }
});

// POST /api/routes — save a new route
router.post('/', auth, async (req, res) => {
    try {
        const { name, date, stops, metrics, totalDistance, totalStops, estimatedCost, estimatedTime } = req.body;

        const route = new Route({
            userId: req.user.id,
            name,
            date,
            stops,
            metrics,
            totalDistance,
            totalStops,
            estimatedCost,
            estimatedTime,
        });

        await route.save();
        res.status(201).json(route);
    } catch (error) {
        console.error('Save route error:', error);
        res.status(500).json({ message: 'Server error saving route' });
    }
});

// DELETE /api/routes/:id — delete a saved route
router.delete('/:id', auth, async (req, res) => {
    try {
        const route = await Route.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Delete route error:', error);
        res.status(500).json({ message: 'Server error deleting route' });
    }
});

export default router;
