import type { AccessObject } from '../cli';

function history({ cli }: AccessObject) {
    const highestIndex = cli.history.length;
    return cli.history.map((command, index) => {
        const num = String(index + 1).padStart(String(highestIndex).length + 2, ' ');
        return `${num}  ${command}`;
    }).join('\n');
}
history.description = 'Changes current working directory';

export default history;
