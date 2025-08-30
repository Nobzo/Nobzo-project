function buildCommentTree(comments) {
    const commentMap = {};
    const roots = [];

    comments.forEach(comment => {
        comment = comment.toObject();
        comment.replies = [];
        commentMap[comment._id] = comment;
    });

    comments.forEach(comment => {
        if (comment.parentCommentId) {
            const parent = commentMap[comment.parentCommentId];
            if (parent) {
                parent.replies.push(comment);
            }
        } else {
            roots.push(comment);
        }
    });

    return roots;
}

module.exports = buildCommentTree;
