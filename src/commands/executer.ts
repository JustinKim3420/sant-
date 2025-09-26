
export interface Command {
    execute: () => void
    undo: () => void
    clone: () => Command
}


export class CommandExecuter {
    private commandHistory: Command[] = []
    private redoHistory: Command[] = []

    execute(command: Command) {
        const executeCommand = command.clone()
        executeCommand.execute()
        this.commandHistory.push(executeCommand)
        this.redoHistory = []
    }
    undo() {
        if (this.commandHistory.length > 0) {
            const command = this.commandHistory.pop()
            if (!command) { return }
            command.undo()
            this.redoHistory.push(command)
        }
    }
    redo() {
        if (this.redoHistory.length > 0) {
            const command = this.redoHistory.pop()
            if (!command) { return }
            command.execute()
            this.commandHistory.push(command)
        }
    }
}