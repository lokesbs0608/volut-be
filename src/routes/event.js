const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByOrganizationId,
} = require("../controllers/eventController");
const router = express.Router();

router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/organization/:organizationId/events", getEventsByOrganizationId);
module.exports = router;
