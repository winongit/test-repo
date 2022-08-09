const express = require('express');
const router = express.Router();

const {createBid, deleteBid, getMyBids} = require('../controllers/BiddingController')

router.post('/auction/:auction_id', createBid);

router.delete('/:bid_id/auction/:auction_id', deleteBid);

router.get('/', getMyBids)

module.exports = router;
