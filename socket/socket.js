const throttleByKey = require('../utilities/throttle'); // in-memory; swap for Redis in prod
const Meme = require('../models/memes');

module.exports = function registerSockets(io) {
  io.on('connection', (socket) => {
    // Join/leave a meme room
    socket.on('join_meme', ({ memeId }) => {
      if (!memeId) return;
      socket.join(`meme:${memeId}`);
    });

    socket.on('leave_meme', ({ memeId }) => {
      if (!memeId) return;
      socket.leave(`meme:${memeId}`);
    });

    // View pings (e.g., on load or every N seconds while visible)
    socket.on('view_ping', async ({ memeId, userKey }) => {
      try {
        if (!memeId) return;
        // userKey could be userId, or ip+ua hash for guests
        const key = `view:${memeId}:${userKey || socket.handshake.address}`;
        const ok = throttleByKey(key, 30_000); // 30s per userKey per meme
        if (!ok) return;

        const meme = await Meme.findByIdAndUpdate(
          memeId,
          { $inc: { viewCount: 1 } },
          { new: true, projection: { viewCount: 1 } }
        ).lean();

        if (meme) {
          io.to(`meme:${memeId}`).emit('meme:view_updated', {
            memeId,
            viewCount: meme.viewCount
          });
        }
      } catch (e) {
        // swallow; keep socket clean
      }
    });
  });
};
