import Message from "../Model/Message"
export const newMessage = async (req, res) => {
    const { conversationId, text, sender } = req.body;
    let message;
    try {
        message = new Message({ conversationId, text, sender })
        message = await message.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected error Occured" });
    }
    return res.status(202).json(message)
};

export const getMessage = async (req, res) => {
    let message;
    try {
        message = await Message.find({
            conversationId: req.params.conversationId
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unexpected error Occured" });
    }
    return res.status(202).json(message)
};
