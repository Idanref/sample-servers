const { Router } = require('express');
const historyController = require('../controllers/history-controller');

const router = Router();

// Get {count} items: {uri}/history/spcific/{server_id}?count={count}
// Get all items:  {uri}/history/spcific/{server_id}
router.get('/specific/:server_id', historyController.getLastHistoryByServerId);

router.post('/create', historyController.createHistoryRequest);

module.exports = router;
