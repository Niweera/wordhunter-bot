const SlackBot = require("slackbots");
const axios = require("axios");

const bot = new SlackBot({
  token: PROCESS.node.env.TOKEN,
  name: "WordHunter"
});

// Start Handler
bot.on("start", () => {
  const params = {
    icon_emoji: ":smiley:"
  };

  bot.postMessageToChannel(
    "general",
    "WordHunter: Find the words you've been always looking for!",
    params
  );
});

// Error Handler
bot.on("error", err => console.log(err));

// Message Handler
bot.on("message", data => {
  if (data.type !== "message") {
    return;
  }

  handleMessage(data.text);
});

// Respons to Data
function handleMessage(message) {
  if (message.includes(" hunt ")) {
    const word = message.split(" ")[2];
    console.log(word);
    hunt(word);
  } else if (message.includes(" help")) {
    runHelp();
  }
}

// Find the words with the letters
const hunt = word => {
  axios.get(`http://wh.niweera.gq/${word}`).then(res => {
    const wordArray = res.data;
    let dict = "";
    wordArray.forEach(word => {
      dict = dict + word.word + " " + "- " + word.definition + "\n";
    });

    const params = {
      icon_emoji: ":laughing:"
    };

    bot.postMessageToChannel(
      "general",
      `Here are the word(s): \n ${dict}`,
      params
    );
  });
};

// Show Help Text
const runHelp = () => {
  const params = {
    icon_emoji: ":question:"
  };

  bot.postMessageToChannel(
    "general",
    `To get the words type @WordHunter [hunt] <letters> \nNo need to seperate letters with spaces or commas \nCheckout the web version @ https://wordhunter.niweera.gq`,
    params
  );
};
