const {createAuction, getAllAuctions, getAuction, cancelAuction, extendAuction} = require('../services/AuctionService');

module.exports.createAuction = async(req, res) => {
    try {
        console.log('I am on create auction');
        const auctionFromWeb = req.body;

        
        auctionFromWeb.created_by = req.user;
        auctionFromWeb.modified_by = req.user;
        
        let auction = await createAuction(auctionFromWeb);
        res.json(auction);
    } catch (err) {
        console.log(err)
        res.status(400).send({
            message: err
        });
    }
}

module.exports.uploadPhoto = (req, res) => {
    res.status(200).json({filename: req.file.filename});
};

module.exports.getAllAuctions = async(req, res) => {
    try {
        let auctions = await getAllAuctions(req, res);
        res.json(auctions);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: error
        });
    } 
}

module.exports.getAuction = async (req, res) => {
    try {
        const {auction_id} = req.params;
        let auction = await getAuction(req, res, auction_id);
        res.json(auction);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: error
        });
    }    
}

module.exports.cancelAuction = async(req, res) => {
    try {
        const {auction_id} = req.params;

        let resposne = await cancelAuction(auction_id);
        res.json(resposne);
        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: error
        });
    }
}

module.exports.extendAuction = async(req, res) => {
    try {
        const {auction_id} = req.params;
        const {new_end_time} = req.body;

        let resposne = await extendAuction(req, res, auction_id, new_end_time)
        res.json(resposne);

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: error
        });   
    }

}