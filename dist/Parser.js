import{ParserError as r}from"./errors/ParserError.js";export class Parser{parse(r,s){return this.consumeUsing(s??this.parserMain,r)}add(r,s){this.parserMain??=r,this.parsers.set(r,s)}consumeUsing(s,e){return this.parsers.get(s)({consumer:e,consume:r=>this.consumeUsing(r,e),error:s=>{throw new r(s)}})}constructor(){this.parsers=new Map}}