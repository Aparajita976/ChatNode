import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const messageSchema = new Schema({
    conversationId: {
        type: String,

    },
    sender: {
        type: String,

    },
    text: {
        type: String,

    },

}
)

export default mongoose.model("Message", messageSchema);