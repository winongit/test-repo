const { mongo } = require("mongoose");
const Auction = require("../models/Auction");

async function createBid(req, res, bid, auctionId) {
  bid.status = "A";
  bid.created_at = Date.now();
  bid.updated_at = Date.now();

  console.log("bid udpdate");
  console.log(auctionId);
  console.log(bid);

  let auctionFromDB = await Auction.findById(auctionId);

  if (auctionFromDB.created_by._id === bid.created_by.id) {
    throw "bid is not allowed for the auction creation user";
  }

  if (bid.bid_amount < auctionFromDB.price) {
    throw "bid amount is less than auction amount";
  }

  // created_by and modified by will be added by the middle ware
  let response = await Auction.updateOne(
    { _id: auctionId },
    { $push: { bids: bid } }
  );

  auctionFromDB = await Auction.findById(auctionId);

  auctionFromDB.bids = auctionFromDB.bids.filter(
    (a) => a.created_by._id === req.user._id
  );

  return auctionFromDB;
}

async function deleteBid(req, res, auction_id, bid_id) {
  let auctionFromDB = await Auction.findById(auction_id);
  console.log(auctionFromDB);

  console.log("bid id" + bid_id);

  let bidFromDB = auctionFromDB.bids.find((b) => b._id == bid_id);

  console.log(bidFromDB);

  if (!bidFromDB) {
    throw "Invalid bid";
  }

  if (bidFromDB.created_by._id !== req.user._id) {
    throw "You are not allowed to delete this bid";
  }

  let response = await Auction.updateOne(
    { _id: auction_id },
    { $pull: { bids: { _id: bid_id } } }
  );

  return response;
}

async function getMyBids(req, res) {
  let user_id = req.user._id;

  let auctionFromDB = await Auction.find({
    "bids.$.created_by._id": user_id,
  });

  auctionFromDB.map((a) => {
    let max = Math.max(...a.bids.map((b) => b.bid_amount));
    a.max_bid_amount = max;
  });

console.log(auctionFromDB);

  return auctionFromDB;
}

module.exports = { createBid, deleteBid, getMyBids };
