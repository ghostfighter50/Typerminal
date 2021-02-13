import { Terminal } from "./Classes/Terminal" 
import * as readline from "readline" 
import * as chalk from "chalk"
import * as os from "os"

/**
 * Represents the Terminal Object, it emits and receives events
 * @class
 * @returns {string} the output or error of the executed command
 */
const terminal = new Terminal()

//Initialization of the user interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

//global variable used to update the current directory path after a cd command
let UserLine: string

/**
 * Used to log the output to the console without interfering with the readline stream
 * @param  {string} data pauses the readline stream and logs the param to the console
 */

function Log(data) {
    rl.pause()
    console.log(data)
    rl.resume()
    setTimeout(() => { rl.emit("line")}, 100)
}

// Initiates the shell by creating a new prompt
rl.emit("line")

//Main event, it prompts user input for commands
rl.on("line", () => {
    //banner
    UserLine = `${chalk.blue("┌──(") + chalk.bold(chalk.redBright(os.userInfo().username))+"㉿" + chalk.bold(chalk.redBright(os.hostname())) + chalk.blue(")-[") + process.cwd() + chalk.blue("]\n└─") + chalk.redBright("#")} `

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
                    terminal.execute(`tasklist`);
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
                    terminal.execute(`taskkill /PID ${args[1]}`);
                    break;
                case "clear":
                    console.clear();
                    break;

                case "exit":
                    process.exit(0)
                default:
                    if (args.toString().length !== 0) { terminal.execute(args.toString()) } 
                    else rl.emit('line')
            }
        })
    } catch { return }
})

//listens for output
terminal.on("command", data => { Log(data) })
//listens for errors
terminal.on("error", err => { return err })

