const originFca = require("fb-chat-support");
const axios = require("axios");

// Downloader Module built inside FCA by Mr.King
const Downloader = {
  // TikTok Video Downloader
  async tiktok(url) {
    try {
      const res = await axios.post("https://tikwm.com/api/", { url: url });
      if (res.data && res.data.data) {
        return {
          status: true,
          author: "Mr.King",
          title: res.data.data.title,
          play: res.data.data.play,
          music: res.data.data.music
        };
      }
      throw new Error("Invalid TikTok response");
    } catch (e) {
      return { status: false, error: e.message };
    }
  },

  // Facebook Video Downloader
  async facebook(url) {
    try {
      const res = await axios.get(`https://api.vytal.workers.dev/fb?url=${encodeURIComponent(url)}`);
      return {
        status: true,
        author: "Mr.King",
        hd: res.data.hd,
        sd: res.data.sd
      };
    } catch (e) {
      return { status: false, error: "Failed to fetch Facebook video" };
    }
  },

  // YouTube Direct Downloader (Cobalt API)
  async youtube(url) {
    try {
      const res = await axios.get(`https://api.cobalt.tools/api/json`, {
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        data: { url: url }
      });
      return { status: true, author: "Mr.King", url: res.data.url };
    } catch (e) {
      return { status: false, error: "Failed to process YouTube link" };
    }
  }
};

// Main FCA Login Wrapper by Mr.King
function login(credentials, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  return originFca(credentials, options, (err, api) => {
    if (err) return callback(err);

    // Custom Metadata & Author Info
    api.fcaInfo = {
      author: "Mr.King",
      packageName: "fca-mr-king",
      version: "1.0.0"
    };

    // Attach Built-in Downloaders
    api.downloader = Downloader;

    // Helper: Stream Attachment direct from URL
    api.sendAttachmentFromUrl = async (url, threadID, body = "", messageID = null) => {
      try {
        const stream = (await axios.get(url, { responseType: "stream" })).data;
        return api.sendMessage({ body: body, attachment: stream }, threadID, messageID);
      } catch (err) {
        return api.sendMessage("Failed to send attachment from URL", threadID, messageID);
      }
    };

    console.log(`[ FCA-MR-KING ] Connected successfully! Created by Mr.King`);
    return callback(null, api);
  });
}

module.exports = login;

