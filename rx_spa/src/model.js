import * as tf from '@tensorflow/tfjs';
const LATENT_DIM = 64;
const NUM_CHARS = 38;

//const MODEL_URL = 'https://rx.coxy1989.com/train_tfjs/model.json'
const MODEL_URL = 'http://localhost:3000/train_tfjs/model.json'

const idx_char = {0: 'START',
                  1: '\n',
                  2: ' ',
                  3: "'",
                  4: '-',
                  5: '/',
                  6: '0',
                  7: '1',
                  8: '3',
                  9: '5',
                  10: '7',
                  11: 'A',
                  12: 'B',
                  13: 'C',
                  14: 'D',
                  15: 'E',
                  16: 'F',
                  17: 'G',
                  18: 'H',
                  19: 'I',
                  20: 'J',
                  21: 'K',
                  22: 'L',
                  23: 'M',
                  24: 'N',
                  25: 'O',
                  26: 'P',
                  27: 'Q',
                  28: 'R',
                  29: 'S',
                  30: 'T',
                  31: 'U',
                  32: 'V',
                  33: 'W',
                  34: 'X',
                  35: 'Y',
                  36: 'Z',
                  37: 'É'}

function sample(probs) {
    const sum = probs.reduce((a, b) => a + b, 0)
    if (sum <= 0) throw Error('probs must sum to a value greater than zero')
    const normalized = probs.map(prob => prob / sum)
    const sample = Math.random()
    let total = 0
    for (let i = 0; i < normalized.length; i++) {
        total += normalized[i]
        if (sample < total) return i
    }
}

export async function loadModel(){
  return await tf.loadModel(MODEL_URL);
}

export function generate(train_model){

  var h0 = tf.tensor([Array(LATENT_DIM).fill(0)]);
  var c0 = tf.tensor([Array(LATENT_DIM).fill(0)]);
  var x0 = Array(NUM_CHARS).fill(0);
  x0[0] = 1;
  x0 = tf.tensor([[x0]]);

  const inf_model_x = train_model.input
  const lstm = train_model.layers[1]
  const dense = train_model.layers[2]

  const inf_model_h = tf.input({shape:[LATENT_DIM]})
  const inf_model_c = tf.input({shape:[LATENT_DIM]})

  const lstm_res = lstm.apply(inf_model_x, {initialState: [inf_model_h, inf_model_c]})
  const outs = dense.apply(lstm_res[0])

  const inputs = [inf_model_x, inf_model_h, inf_model_c]
  const outputs = [outs, lstm_res[1], lstm_res[2]]
  const inf_model = tf.model({inputs: inputs, outputs:outputs})


  var string = '';
  var stopCondition = false
  while (!stopCondition) {
    const res = inf_model.predict([x0, h0, c0]);
    const probs = Array.from(res[0].dataSync());
    const idx = sample(probs);
    const ch = idx_char[idx];
    string += ch;
    h0 = res[1]
    c0 = res[2]
    x0 = Array(NUM_CHARS).fill(0);
    x0[idx] = 1;
    x0 = tf.tensor([[x0]]);
    if (ch === '\n' | (string.length + 1) > 30){
      stopCondition = true
    }
  }
  return string
}

