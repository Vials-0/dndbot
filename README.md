# DnDbot

A simple discord bot written in Node.js 

## Config

You'll need a config.json file at the root of your project directory. It should have the following fields:

* prefix - The command prefix you would like your bot to listen to
* token - Your Discord token 
* [baseWikiUrl](http://dnd5eapi.co) - Base URL used for querying the DnD API

```
{
    "prefix": "!",
    "token": "your-token-goes-here",
    "baseWikiUrl": "http://dnd5eapi.co/api"
}
```