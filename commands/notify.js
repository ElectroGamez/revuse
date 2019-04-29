module.exports = class Notify extends Command {
  constructor() {
    super();
    this.trigger = "notify";
  }

  executeCustom(command, input, message) {
    language.respond('confirm', emotionValue, (response) => message.channel.send(response));

    let oldStatus;
    setInterval(() => {
      personRepository.getByFirst(input[0], (personCollection) => {
        let personArray = personCollection.getPersons();

        personArray.forEach((personObject) => {
            personObject.getDiscordStatus((newStatus) => {
              if (oldStatus != newStatus && typeof oldStatus !== 'undefined') {
                message.channel.send(`${personObject.getFullname()} went from ${oldStatus} to ${newStatus}`);
              }

              oldStatus = newStatus;
            });
          });
      });
    }, 1000);
  }
}
