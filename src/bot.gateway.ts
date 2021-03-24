
/*bot.gateway.ts*/

import { Injectable, Logger } from '@nestjs/common';
import { DiscordClientProvider, On, Once, OnCommand, UsePipes } from 'discord-nestjs';
import { Message, MessageEmbed, User } from 'discord.js';
@Injectable()
export class BotGateway {

  numbersAsked: number[]  = [];
  winnarnummers: number[] = [];
  numbercounttill: number;
  feedbackwrong: boolean = true;


  private readonly logger = new Logger(BotGateway.name);
  constructor(private readonly discordProvider: DiscordClientProvider){

  }

  @Once({ event: 'ready' })
  onReady(): void {
    console.log(`Logged in as ${this.discordProvider.getClient().user.tag}!`);
    this.discordProvider.getClient().user.setStatus('online')

    this.discordProvider.getClient().user.setActivity('simping for Mlone', {
      type: "PLAYING",
    });
    //this.discordProvider.getWebhookClient().send('hello bot is up!');
  }
  
  @On({ event: 'message' })
  async adminInTest(message: Message): Promise<void> {
    if(message.channel.id === '' && message.author.id != "814853064632696842"){// && message.author.id == ""){//id of admin channel. and user id of who can edit
      if(message.content.includes("county help")){
        await message.channel.send(
"**admin commands**\n\
*set range:*                                     county numbersbetween {amount}\n\
*create new winner nummer:*   county winnarnummers new\n\
*disable wrong number message:* county feedbackwrong\n\
*get winnar nummers:*                county winnarnummers show\n\
*remove winnar nummer:*          county winnarnummers remove {amount}\n\
**normal commands**\n\
*get used numbers:*                      county used\n\
to count just put a number in the correct channel");
      }
      else if(message.content.includes("county numbersbetween")){
        let split = message.content.split(" ");
        if(split.length == 3){
          this.numbersAsked = [];
          this.winnarnummers = []
          this.numbercounttill = parseInt(split[split.length -1]);
          await message.reply(`number between 1 and `+ this.numbercounttill);
          this.winnarnummers = [];
          console.log("numbers till: "+this.numbercounttill);
        }
      }
      else if(message.content.includes("county feedbackwrong")){
        this.feedbackwrong = !this.feedbackwrong;
        await message.reply(`feedback when wrong is `+ this.feedbackwrong);
      }
        else if(message.content.includes("county winnarnummers new")){
          if(this.numbercounttill!=null){
            let newnumber;
            for(let i = 20; i>0; i--){
              newnumber = Math.floor(Math.random() * this.numbercounttill) + 1;
              if(this.winnarnummers.indexOf(newnumber)<0){
                break;
              }
              else{
                newnumber = null;
              }
            }
            if(newnumber){
              this.winnarnummers.push(newnumber);
              await message.reply(`new winnar number has been added, total off: `+ this.winnarnummers.length);
              console.log("the numbers are: "+this.winnarnummers.join(", "));
            }
            else{
              await message.reply(`no unused number available`);
            }
          }
          else{
            await message.reply(`new winnar number has been added, total off: `+ this.winnarnummers.length);
          }
        }
        //get winnumber
        else if(message.content.includes("county winnarnummers show")){
          if(this.numbercounttill!=null){
            await message.author.send(`numbers are: `+ this.winnarnummers.join(", "));
            console.log("the numbers are: "+this.winnarnummers.join(", "));
          }
          else{
            await message.reply(`No winnar numbers yet`);
                console.log("the numbers are now(one removed): "+this.winnarnummers.join(", "));
          }
        }
        //removing winnumber
        if(message.content.includes("county winnarnummers remove")){
          if(this.numbercounttill!=null){
            let split = message.content.split(" ");
            if(split.length == 4){
              let find = this.winnarnummers.indexOf(parseInt(split[split.length-1]));
              if(find>=0){
                this.winnarnummers.splice(find,1)
                await message.reply(`One number for winning has been removed, amount now: `+ this.winnarnummers.length);
                console.log("the numbers are now(one removed): "+this.winnarnummers.join(", "));
              }
            }
          }
        }
    }
  }
    // console.log(message);
    // //mention user means <@!id>
    // //mention chat means <#id>
    // //message.content //get message after name and prefix
    // //message.author //get author id/usnername/code   
    // //message.guild.members.cache.get(message.author.id) to get user info like roles and .nickname
    // console.log(message.content)
    // await message.reply(`Execute command: ${message.content}`);
  @On({ event: 'message'})//change to propper channel
  async inCount(message: Message): Promise<void> {
    if(message.channel.id === '' && message.author.id != ""){//id of play channel. maybe remove author id.
      let number = parseInt(message.content);
      if(message.content.includes("county help")){
        await message.channel.send(
"**commands:**\n\
*get used numbers:*                      county used\n\
to count just put a number in here.\
numbers to guess left: "+this.winnarnummers.length);
      }
      else if(message.content.includes("county used") && this.winnarnummers.length>0){
        this.numbersAsked.sort(function(a, b){return a-b});
        let text = `Already tried: `+ this.numbersAsked.join(", ");
        while(text.length>0){
          let split = text.substring(0,1500);
          text = text.substring(1500);
          await message.channel.send(split, { split: true });
        }
        console.log("the numbers are now: "+this.winnarnummers);
      }
      //if user puts number in channel
      
      else if(number+"" == message.content && this.winnarnummers.length>0){
        if(number > this.numbercounttill || number < 1){
          if(this.feedbackwrong)await message.reply("number: "+message.content+" is to high.\nchoose an number between between 1 and "+this.numbercounttill);
        }
        else if(this.winnarnummers.indexOf(number)>=0){
          let correctnummerIndex = this.winnarnummers.indexOf(number)
          this.numbersAsked.push(number);
          let embededmessage: MessageEmbed = this.createembeded(message.author, number);
          message.channel.send(embededmessage);
          message.channel.send("<@&>");//id of who to tag(or role)
//           await message.channel.send(`<@!${message.author.id}> <:pepeyes:> you won <:woohoo:>  !  ${number} was correct. \n
// numbers left: ${this.winnarnummers.length-1} \n
// <@&814913608391065600> come check`);
          this.winnarnummers.splice(correctnummerIndex,1)
        }
        else{
          if(this.numbersAsked.indexOf(number)<0){
            this.numbersAsked.push(number);
          }
          console.log("already asked: "+this.numbersAsked);
          if(this.feedbackwrong)await message.reply("Wrong <:pepeno:>");
        }
      }
      else{
        if(this.feedbackwrong)await message.reply("Is this a correct command or are there no wins available. Check with `county help`");
      }
    }
  }

  createembeded(user:User, correctNumber:number): MessageEmbed{
    return new MessageEmbed().setColor('#0099ff').setTitle(':tada: Congratulations, '+user.tag)
	.setDescription('The number you guessed was right! There is '+(this.winnarnummers.length-1)+" number to be guessed left. ")
	.addFields(
		{ name: '**Correct Number:**', value: correctNumber, inline: true  },
		{ name: '**Winner:**', value: "<@!"+user.id+">", inline: true },
		{ name: 'Guesses', value: this.numbersAsked.length, inline: true },
	)
  }

}