import express from "express";
import axios from "axios";
import Appointment from "../models/AppointmentModel.js";

const router = express.Router();

router.post("/:id/start", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    if (appointment.status === "started") return res.json(appointment);

    // Create Daily.co room
    const response = await axios.post(
      "https://api.daily.co/v1/rooms",
      { properties: { exp: Math.round(Date.now() / 1000) + 3600 } },
      { headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` } }
    );

    const roomUrl = response.data.url;
    const roomId = roomUrl.split("/").pop();

    appointment.roomId = roomId;
    appointment.status = "started";
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to start consultation" });
  }
});

export default router;
