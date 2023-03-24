import type { AccessObject } from "../types"

/**
 * Runs a command in G A M E R M O D E
 * @param param0 {AccessObject} Command
 * @returns Output of command in G A M E R M O D E
 */
function sudo({ command: { raw }, cli }: AccessObject): string {
    const sudocommand = raw.split(" ").slice(1).join(" ")
    if (!sudocommand) return "sudo: missing command"
    const parsed = cli._argParser(sudocommand)
    const output = cli._execute(parsed)
    return `<span style="color: red;">Running ${sudocommand} in G A M E R M O D E: </span>\n${output}`
}
sudo.description = "Runs a command in G A M E R M O D E"

export default sudo