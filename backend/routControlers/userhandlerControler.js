import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch=async(req,res)=>{
try {
    const search = req.query.search || '';
    
    console.log('Search request - req.user:', req.user);
    console.log('Search request - req.user.userId:', req.user?.userId);
    console.log('Search request - req.user._id:', req.user?._id);
    
    const currentUserID = req.user.userId || req.user._id;
    
    console.log('Search request:', { search, currentUserID, user: req.user });
    
    if (!currentUserID) {
        console.log('No currentUserID found, req.user:', req.user);
        return res.status(500).send({
            success: false,
            message: 'User ID not found in request'
        });
    }
    
    const user = await User.find({
        $and:[
            {
                $or:[
                    {username:{$regex:'.*'+search+'.*',$options:'i'}},
                    {fullname:{$regex:'.*'+search+'.*',$options:'i'}}
                ]
            },{
                _id:{$ne:currentUserID}
            }
        ]
    }).select("-password -email")

    console.log('Search results:', user);
    res.status(200).send(user)

} catch (error) {
    console.log('User search error:', error);
    res.status(500).send({
        success: false,
        message: error.message || 'Search failed'
    })
}
}


export const getCorrentChatters=async(req,res)=>{
    try {
        console.log('CurrentChatters request - req.user:', req.user);
        const currentUserID = req.user.userId || req.user._id;
        console.log('CurrentChatters - currentUserID:', currentUserID);
        
        if (!currentUserID) {
            console.log('No currentUserID found in currentchatters, req.user:', req.user);
            return res.status(500).send({
                success: false,
                message: 'User ID not found in request'
            });
        }
        const currenTChatters = await Conversation.find({
            participants:currentUserID
        }).sort({
            updatedAt: -1
            });

            if(!currenTChatters || currenTChatters.length === 0)  return res.status(200).send([]);

            const partcipantsIDS = currenTChatters.reduce((ids,conversation)=>{
                const otherParticipents = conversation.participants.filter(id => id !== currentUserID);
                return [...ids , ...otherParticipents]
            },[])

            const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currentUserID.toString());

            const user = await User.find({_id:{$in:otherParticipentsIDS}}).select("-password -email");

            const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id.toString()));

            res.status(200).send(users)

    } catch (error) {
        console.log('Current chatters error:', error);
        res.status(500).send({
            success: false,
            message: error.message || 'Failed to load chatters'
        })
    }
}