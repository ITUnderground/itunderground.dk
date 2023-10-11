export function formatId(text: string | undefined) {
	if (!text) return '';
	return text
		.toLowerCase()
		.replace(/[^a-z0-9-_— ]/g, '')
		.trim()
		.replace(/ /g, '-')
		.replace('—', '--');
}
