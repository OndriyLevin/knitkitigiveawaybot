require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');

const JsonFile = require('jsonfile')

var fs = require('fs')
var fspro = require('fs').promises

let obj = {
    participants: []
};

const bot = new TelegramBot(process.env.TOKEN_BOT, {

    polling: true
    
});


bot.on('message', async msg => {
    if(msg.text.includes('Розыгрыш')) {
        fs.readFile(`giveaway ${msg.message_id}.json`, 'utf8', function readFileCallback(err, data) {
            if (err){
                var json = JSON.stringify(obj)
                console.log(json)
                fs.writeFile(`giveaway${msg.message_id}.json`, json,'utf8', function readFileCallback(err, data) {
                    if (err){
                        console.log(err)                                
                    }
                });                              
            } 
        } )
    }
    if(msg.text.includes('addme')){
        fs.readFile(`giveaway${msg.message_thread_id}.json`, 'utf8', function readFileCallback(err, data) {
            if (err){
                console.log(err)
            } else {
                obj = JSON.parse(data);
                console.log(obj)
                if (obj.participants.includes(msg.from.username) === true){

                } else {
                    obj.participants.push(
                        msg.from.username
                    )
                }
                var json = JSON.stringify(obj)
                fs.writeFile(`giveaway${msg.message_thread_id}.json`, json,'utf8', function readFileCallback(err, data) {
                    if (err){
                        console.log(err)                                
                    }
                }); 
            }
        } )
    }
    if(msg.text.includes('resultgiveaway')){
        
        let json = await fspro.readFile(`giveaway${msg.message_thread_id}.json`, 'utf8', function readFileCallback(err, data) {
            if (err){
                console.log(err)
            }
        })
        obj = JSON.parse(json)
        var winner = Math.floor(Math.random() * (obj.participants.length - 1) + 1)
        await bot.sendMessage(msg.reply_to_message.forward_from_chat.id, `Подарок твой, @${obj.participants.at(winner)}`);
        fs.rm(`giveaway${msg.message_thread_id}.json`, { recursive: false } , function readFileCallback(err, data) {
            if (err){
                console.log(err)
            }
        })
    }
})