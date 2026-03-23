// AI_P: AI-driven signal processing and RF calculations
// Created by Bon (RF Engineer)

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- RF Signal Analysis ---
const calculateFSPL = (frequencyGHz, distanceKm) => {
    // Free-Space Path Loss (FSPL) in dB: 20*log10(d) + 20*log10(f) + 92.45
    const fspl = 20 * Math.log10(distanceKm) + 20 * Math.log10(frequencyGHz) + 92.45;
    return fspl.toFixed(2);
};

// API Endpoints
app.get('/api/status', (req, res) => {
    res.json({
        status: "Online",
        message: "AI_P Backend API is ready for signal analysis."
    });
});

app.post('/api/calculate/fspl', (req, res) => {
    const { frequencyGHz, distanceKm } = req.body;
    
    if (frequencyGHz === undefined || distanceKm === undefined) {
        return res.status(400).json({ error: "Missing required parameters: frequencyGHz, distanceKm" });
    }

    const loss = calculateFSPL(frequencyGHz, distanceKm);
    
    res.json({
        frequencyGHz,
        distanceKm,
        lossDb: parseFloat(loss)
    });
});

// Generate dummy data for the visualization chart
app.post('/api/simulate/fspl-sweep', (req, res) => {
    const { frequencyGHz, maxDistanceKm, steps } = req.body;
    
    if (!frequencyGHz || !maxDistanceKm || !steps) {
         return res.status(400).json({ error: "Missing required parameters" });
    }

    const data = [];
    const stepSize = maxDistanceKm / steps;
    
    for (let i = 1; i <= steps; i++) {
        const d = i * stepSize;
        data.push({
            distance: d.toFixed(2),
            loss: parseFloat(calculateFSPL(frequencyGHz, d))
        });
    }

    res.json(data);
});

app.listen(PORT, () => {
    console.log(`\x1b[36m[AI_P Backend]\x1b[0m API running on port \x1b[33m${PORT}\x1b[0m`);
});
