const express = require('express');
const {
    registerOrganization,
    getAllOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization
} = require('../controllers/organizationController');
const router = express.Router();

router.post('/register', registerOrganization);
router.get('/', getAllOrganizations);
router.get('/:id', getOrganizationById);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

module.exports = router;
