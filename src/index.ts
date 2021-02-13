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

let UserLine: string

function Log(data) {
    rl.pause()
    console.log(data)
    rl.resume()
    rl.emit('line', '')

}

rl.on("line", () => {
    UserLine = `${chalk.blue("┌──(") + chalk.bold(chalk.redBright(os.userInfo().username))+"㉿" + chalk.bold(chalk.redBright(os.hostname())) + chalk.blue(")-[") + process.cwd() + chalk.blue("]\n└─") + chalk.redBright("#")} `

    try {
        rl.question(UserLine, cmd => {

            const args: any = cmd.split(/ +/g)

            switch (args[0]) {
                case "cd":
                    if (!args[1]) return console.log("Missing argument ! Usage : cd <directory>")
                    else {
                        terminal.execute(`cd ${args[1]}`);
                        try {
                            process.chdir(args[1])
                        } catch {
                            return
                        }
                        break;
                    }
                    case "ls":
                        terminal.execute("dir")
                        break;
                    case "rm":
                        if (args[1] == "-rf") {
                            terminal.execute(`rmdir /s /q ${args[2]}`)

                        } else {
                            terminal.execute(`del ${args[1]}`)
                            rl.emit("line")

                        }
                        break;
                    case "touch": terminal.execute(`echo > ${args[1]}`); break;
                    case"clear": console.clear(); break;
                    case "exit":
                        process.exit(0)
                    default:
                        if(args.toString().length !== 0) {
                         terminal.execute(args.toString())
                         setTimeout(() => {rl.emit("line")}, 100)
                        }
                        else rl.emit('line')
            }
           
        })
    } catch {
        return
    }
})
terminal.on("command", data => {
    Log(data)
})