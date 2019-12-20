const synth = window.speechSynthesis;

const utterance = new SpeechSynthesisUtterance();

const cancelFormerSpeak = () => {
  synth.cancel();
}

const speak = (content) => {
  utterance.text = content;
  synth.speak(utterance);
}

const forceSpeak = (content) => {
  cancelFormerSpeak();
  speak(content);
}

const SpeakControl = { cancelFormerSpeak, speak, forceSpeak };

export default SpeakControl;
