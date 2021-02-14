import { exec } from "child_process"
import { EventEmitter } from 'events'

export class Terminal extends EventEmitter {

    constructor() {
        super()
    }
/**
 * Executes the specified command
 * @param {string} command Windows DOS command
 * @returns {string} the stdout of the command via events
 * @event command returns the stdout
 */
    async execute(command: string) {

        exec(command, (err, stdout) => {
            if (err) {
                return this.emit("error", err)
            } else {
                this.emit("command", stdout)
            }
        })

    }
}