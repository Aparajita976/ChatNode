import Conversation from "../Model/Conversation"
export const newConversation = async (req, res) => {
    let existingConversation;
    const id1 = req.body.senderId;
    const id2 = req.body.receiverId
    try {
        existingConversation = await Conversation.findOne({
            members: { $all: [id1, id2] },
        });
    }
    catch (err) {
        return console.log(err);
    }
    if (existingConversation) {
        return res.status(400).json({ message: "Conersation Already Exists!" });
    }
    let conversation;
    try {
        conversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId]
        });
        conversation = await conversation.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected error Occured" });
    }
    return res.status(202).json({ conversation })
};


export const getOneId = async (req, res) => {
    const id = req.params.userId;
    // req.user.id we get it from verifyToken: req.user
    //req.params.id to get the id given as route parameter in link

    let conversation;
    try {
        conversation = await Conversation.find({
            members: { $in: [id] },
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected error Occured" });
    }
    res.status(200).json(conversation);
};
export const getAllId = async (req, res) => {
    const id1 = req.params.firstUserId;
    const id2 = req.params.secUserId;
    // req.user.id we get it from verifyToken: req.user
    //req.params.id to get the id given as route parameter in link
    let conversation;
    try {
        conversation = await Conversation.find({
            members: { $all: [id1, id2] },
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected error Occured" });
    }
    res.status(200).json(conversation);
};


export const getAllInfo = async (req, res) => {
    const id = req.params.conversationId;
    let conversation;
    try {
        conversation = await Conversation.findById(id)
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected error Occured" });
    }
    res.status(200).json(conversation);
}