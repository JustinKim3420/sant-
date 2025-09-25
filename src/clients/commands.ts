import { PassThrough } from "stream"
import { Cart } from "./cart"

export interface Command {
    execute: () => void
    undo: () => void
}

export class AddProductCommand implements Command {
    constructor(cart: Cart) {

    }

    execute() {

    }

    undo() {

    }
}

export class CommandExecuter {
    private commandHistory: Command[] = []
    private redoHistory: Command[] = []
    public command: Command

    constructor(initialCommand: Command) {
        this.command = initialCommand
    }
    setCommand(command: Command) {
        this.command = command
    }

    execute() {
        const executeCommand = this.command
        executeCommand.execute()
        this.commandHistory.push(executeCommand)
        this.redoHistory = []
    }
    undo() {
        if (this.commandHistory.length > 0) {
            this.commandHistory.pop()?.undo()
        }
    }
    redo() {
        if (this.redoHistory.length > 0) {
            this.redoHistory.pop()?.execute()
        }
    }
}