import { Terminal } from "./Classes/Terminal" 
import { Aliases } from "./Classes/Aliases" 
import * as readline from "readline" 
import * as chalk from "chalk"
import * as os from "os"
import * as fs from "fs"

/**
 * Represents the Terminal Object, it emits and receives events
 * @class
 * @returns {string} the output or error of the executed command
 */

const terminal = new Terminal()

const aliases = new Aliases("aliases.json")
//Initialization of the user interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

//global variable used to update the current directory path after a cd command
let UserLine: string

let AliasesFile:any = fs.readFileSync("aliases.json")
let data = JSON.parse(AliasesFile)

/**
 * Used to log the output to the console without interfering with the readline stream
 * @param  {string} data pauses the readline stream and logs the param to the console
 */

function Log(data) {
    rl.pause()
    console.log(data)
    rl.resume()
}

// Initiates the shell
console.log("\nPress Enter to start...")
//Main event, it prompts user input for commands
rl.on("line", () => {
    //banner
    UserLine = `${chalk.blue("┌──(") + chalk.bold(chalk.redBright(os.userInfo().username))+"@" + chalk.bold(chalk.redBright(os.hostname())) + chalk.blue(")-[") + process.cwd() + chalk.blue("]\n└─") + chalk.redBright("#")} `

    try {
    //asks for user input
        rl.question(UserLine, cmd => {
            //spliting the input in an array of argmuments
            const args: any = cmd.split(/ +/g)

            //Creation of commands
            switch (args[0]) {

                case "cd":
                    terminal.execute(`cd ${args[1]}`);
                    try { process.chdir(args[1]) } 
                    catch { return }
                    break;


                case "ls":
                    terminal.execute("dir")
                    break;
                
                
                case "rm":
                    if (args[1] == "-rf") { terminal.execute(`rmdir /s /q ${args[2]}`) } 
                    else { terminal.execute(`del ${args[1]}`) }
                    break;
                
                
                case "touch":
                    terminal.execute(`echo > ${args[1]}`);
                    break;
                
                
                case "ps":
                    rl.pause()
                    terminal.execute(`tasklist`);
                    rl.resume()
                    break;
                
                
                case "ifconfig":
                    terminal.execute(`ipconfig`);
                    break;
                
                
                case "reboot":
                    terminal.execute(`shutdown /r /t 1`);
                    break;
                
                
                case "cp":
                    terminal.execute(`copy ${args[1]} ${args[2]}`);
                    break;
               
               
                case "cat":
                    terminal.execute(`type ${args[1]}`);
                    break;
                
                
                case "mv":
                    terminal.execute(`move ${args[1]} ${args[2]}`);
                    break;
                
                
                case "pwd":
                    terminal.execute(`cd ,`);
                    break;
                
                
                case "locate":
                    terminal.execute(`dir ${args[1]} /s`);
                    break;
                
                
                case "kill":
                    rl.pause()
                    terminal.execute(`taskkill /PID ${args[1]}`);
                    rl.resume()
                    break;


                case "clear":
                    console.clear();
                    break;


                case "exit":
                    process.exit(0)

                    
                case "alias":
                    if(args[1] == "create"){ aliases.create(`${args[2]}`, `${args[3]}`); rl.emit('line')}

                    else if(args[1] == "list") { aliases.list(); setTimeout(() => { rl.emit("line")}, 100)}

                    else if(args[1] == "delete") {

                        if(!args[2]) console.log("Usage :\nalias create <name> <value>\n alias delete <name>\nalias edit <name> <new value>\n alias list"); setTimeout(() => { rl.emit("line")}, 100) 
                        
                        aliases.delete(args[2])
                        setTimeout(() => { rl.emit("line")}, 100)
                    }
                    else if(args[1] == "edit") {

                        if(!args[2] || !args[3]) console.log("Usage :\nalias create <name> <value>\n alias delete <name>\nalias edit <name> <new value>\n alias list"); setTimeout(() => { rl.emit("line")}, 100) 
                       
                        aliases.edit(args[2], args[3])
                        setTimeout(() => { rl.emit("line")}, 100)
                    }
                    else console.log("Usage :\nalias create <name> <value>\n alias delete <name>\nalias edit <name> <new value>\n alias list"); setTimeout(() => { rl.emit("line")}, 100) 
                
                    default:                   
                    if (args.toString().length !== 0) { 
                    //search for aliases
                       for (let i = 0; i < data.length; i++) {
                           if (args.toString() === data[i].alias) {
                              terminal.execute(data[i].cmd)
                          }
                          else {
                               terminal.execute(args.toString()) 
                            }
                        }
                    } 
                else rl.emit('line')
            }
        })
    } catch { return }
})

//listens for output
terminal.on("command", data => { Log(data); setTimeout(() => { rl.emit("line")}, 100) })

//listens for errors
terminal.on("error", err => { if(err.cmd.startsWith("alias")) {return} else console.log( err.message.slice(16+err.cmd.length)); setTimeout(() => { rl.emit("line")}, 100) })

//listens for errors on aliases
aliases.on("error", err => console.log(err))

//listens for SGINT event
rl.on("SIGINT", () =>{ console.log("\n\nExiting..."); process.exit(0)})