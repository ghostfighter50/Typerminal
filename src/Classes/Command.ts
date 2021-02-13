import { exec } from "child_process"
import { EventEmitter } from 'events'

export class Command extends EventEmitter{

constructor(){
super()
} 

async execute(command:string){

await exec(command, (err , stdout, stderr) => {
    if(err) { return console.log(command + ": not found")} 
    else {this.emit("command", stdout)} 
})

}  


}  