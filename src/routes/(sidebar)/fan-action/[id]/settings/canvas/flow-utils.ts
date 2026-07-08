export function createNodeId() {
	return `node-${crypto.randomUUID().slice(0, 8)}`;
}
