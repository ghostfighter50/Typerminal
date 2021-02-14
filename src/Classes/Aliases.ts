import * as fs from "fs"
import { EventEmitter } from 'events'

export class Aliases extends EventEmitter {

    /**
     * @param file the json file's path to write the aliases
     */
    constructor(private file: string) {
        super()
        this.file = file
    }

    /**
     * Creates a command alias
     * @param {string} name the alias' name
     * @param {string} command the command to execute when the alias is called
     */

    async create(name: string, command: string) {

        let AliasesFile: any = fs.readFileSync(this.file)
        let data = JSON.parse(AliasesFile)

        data.push({
            alias: name,
            cmd: command,
        })
        fs.writeFileSync(this.file, JSON.stringify(data, null, 4));
    }
    /**
     * Lists the aliases
     */
    async list() {

        fs.readFile(this.file, {
            encoding: "utf-8"
        }, (err, result) => {
            let data = JSON.parse(result)
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].alias + " : " + data[i].cmd + "\n")
            }
        })
    }

    /**
     * Deletes a command alias
     * @param {string} name the alias' name
     */
    async delete(alias:string) {

        let AliasesFile: any = fs.readFileSync(this.file)
        let data = JSON.parse(AliasesFile)
        let newData: any = new Array()

        for (let i = 0; i < data.length; i++) {
            if (data[i].alias = alias) continue
            newData.push(data[i])
        }
        newData.push(`
        [
            {
                "alias": "test",
                "cmd": "echo test"
            }
        ]`)
        fs.writeFileSync(this.file, newData.toString())
    }

    /**
     * Edits a command alias
     * @param {string} name the alias' name
     * @param {string} newcmd the new command
     */

    async edit(alias: string, newcmd: string) {

        let AliasesFile: any = fs.readFileSync(this.file)
        let data = JSON.parse(AliasesFile)
        let newData: any = new Array()

        for (let i = 0; i < data.length; i++) {
            if (data[i].alias = alias) data[i].cmd = newcmd
            newData.push(data[i])
        }

        fs.writeFileSync(this.file, newData.toString())
    }
}