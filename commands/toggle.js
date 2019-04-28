module.exports = class Toggle extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "toggle";
  }

  executeCustom(command, input, message) {
    language.respond('toggle', emotionValue, (response) => message.channel.send(response));

    lampArray.forEach(function(officeLight) {
      officeLight.toggleLight();
    });
  }
}
