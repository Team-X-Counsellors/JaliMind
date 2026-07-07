export interface Reply {
  id: string;
  thread: string;
  author_display: string;
  body: string;
  parent_reply: string | null;
  is_moderated: boolean;
  created_at: string;
}

export interface ReplyNode extends Reply {
  children: ReplyNode[];
}

export function buildReplyTree(flat: Reply[]): ReplyNode[] {
  const nodesById = new Map<string, ReplyNode>();
  flat.forEach((reply) => nodesById.set(reply.id, { ...reply, children: [] }));

  const roots: ReplyNode[] = [];
  nodesById.forEach((node) => {
    if (node.parent_reply && nodesById.has(node.parent_reply)) {
      nodesById.get(node.parent_reply)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}
