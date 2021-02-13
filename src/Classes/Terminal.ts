import { exec } from "child_process"
import { EventEmitter } from 'events'

export class Terminal extends EventEmitter{

constructor(){
super()
} 

async execute(command:string){

await exec(command, (err , stdout, stderr) => {
    if(err) { return this.emit("error", err)} 
    else {this.emit("command", stdout)} 
})

}  


}  