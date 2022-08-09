const Auction = require("../models/Auction");

async function createAuction(auction) {
  auction.status = "A";
  auction.created_at = Date.now();

  let auctionFromDB = await Auction.create(auction);
  return auctionFromDB;
}

async function getAllAuctions(req, res) {
  let authenticatedUserId = req.user._id;

  // Filtering Auction
  let auctions = await Auction.find({}).sort({ created_at: -1 });

  // loop through array;
  auctions.forEach((auction) => {
    // Get max bid amount
    let max = Math.max(...auction.bids.map((b) => b.bid_amount));
    auction.max_bid_amount = max;

    if (auction._id !== req.user._id) {
      auction.bid = auction.bids.filter((a) => a._id === req.user._id);
    }
  });

  // if (req.userid != auction.id)
  // filter the bidszz
  // update bid in auciton

  return auctions;
}

async function getAuction(req, res, auction_id) {
  let auction = await Auction.findById(auction_id);

  auction.bids = auction.bids.filter((a) => a.created_by._id === req.user._id);

  let max = Math.max(...auction.bids.map((b) => b.bid_amount));
  auction.max_bid_amount = max;

  return auction;
}

async function cancelAuction(auction_id) {
  let auctionFromDB = await Auction.findById(auction_id);

  // check status
  if (auctionFromDB.status !== "A") {
    throw "Auction already expired or cancelled";
  }

  let current_time = Date.now();
  if (auctionFromDB.end_time < current_time) {
    throw "Auction already expired";
  }

  let response = Auction.updateOne(
    { _id: auction_id },
    {
      status: "C",
      modifed_at: current_time,
    }
  );

  return response;
}

async function extendAuction(req, res, auction_id, new_end_time) {
  let auctionFromDB = await Auction.findById(auction_id);

  // check user
  if (req.user._id !== auctionFromDB.created_by._id) {
    throw "You are not allowed to extend this auction";
  }

  // check status
  if (auctionFromDB.status !== "A") {
    throw "Auction already expired or cancelled";
  }

  let current_time = Date.now();
  if (auctionFromDB.end_time < current_time) {
    throw "Auction already expired";
  }

  if (new_end_time < current_time) {
    throw "Invalid auction end time";
  }

  let response = Auction.updateOne(
    { _id: auction_id },
    {
      end_time: new_end_time,
      modifed_at: current_time,
    }
  );

  return response;
}

async function getAuctionFor(param) {
  let auctions = await Auction.find(param);

  return auctions;
}

async function updateWinningBid(param, bid) {
  // await req.db.updateOne({_id: school_id, "teachers._id": teacher_id}, {$set: {"teachers.$.name": name}});
  let resposne = await Auction.updateOne(param, {
    $set: { "bids.$.winner": true },
    status: "E",
  });

  return resposne;
}

module.exports = {
  createAuction,
  getAllAuctions,
  getAuction,
  cancelAuction,
  extendAuction,
  getAuctionFor,
  updateWinningBid,
};
