const express = require('express');

const router = express.Router();

router.get('/chats', (req, res) => {
    
    res.send('Chat room');
});

module.exports = router;