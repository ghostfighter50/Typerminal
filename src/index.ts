import { Command } from "./Classes/Command" 
import * as readline from "readline" 
import * as chalk from "chalk"
import * as os from "os"

const terminal = new Command()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

const UserLine:string = `${chalk.blue("┌──(") + chalk.bold(chalk.redBright(os.userInfo().username))+"㉿" + chalk.bold(chalk.redBright(os.hostname())) + chalk.blue(")-[") + process.cwd() + chalk.blue("]\n└─") + chalk.redBright("#")} `  
process.stdout.write(UserLine)

rl.on("line", line => {
process.stdout.write(UserLine)

const args:Array<string> = line.split(/ +/g)

})
