const { Router } = require('express');
const serversController = require('../controllers/servers-controller');

const router = Router();

router.get('/all', serversController.getAllServers);
router.post('/create', serversController.createServer);
router.put('/update/:server_id', serversController.updateServerById);
router.get('/specific/:server_id', serversController.getServerById);
router.delete('/specific/:server_id', serversController.deleteServerById);

module.exports = router;
