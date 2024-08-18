/* eslint-disable */
import  redisClient  from '../utils/redis';
import  dbClient  from '../utils/db';
import { ObjectId } from 'mongodb';
import Queue from 'bull';

const userQueue = new Queue('userQueue');


class MessageController {
    static async newMessage(req, res){
        try {
            const collections = await dbClient.client.db().collection('messages');
            const data = req.body;
            const timestamp = new Date();
            data.createdAt = timestamp;
            await collections.insertOne(data);
            res.status(200).json({status:"sent"})
        } catch (err ){
            console.log(err);
        }
    }

    static async getMessage(req, res){
        const user = req.user;
        if (!user || (user && !user.admin)){
            console.log(user);
            console.log({status:"unothrized"});
            return res.status(401).json({error:'Unauthorized'})
        }
        console.log(user);
        const collection = await dbClient.client.db().collection('messages');
        const messages = await collection.find({}).toArray();
        res.status(200).json(messages);
    }

    static async replyMessage(req, res) {
        const data = req.body;
        const user = req.user;
        if (!user && (user && !user.admin)){
            return res.status(401).json({error:'Unauthorized'})
        }
        data.subject='Reply from Som';
        userQueue.add({user:data});
        res.status(200).json({status:'ok'});
    }
}

export default MessageController;
