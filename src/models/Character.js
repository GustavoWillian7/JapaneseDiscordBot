const { Schema, model } = require('mongoose');

const CharacterSchema = new Schema({
    character: { type: String, required: true },
    romaji: { type: String, required: true },
    type: { type: String, enum: ['hiragana', 'katakana'], required: true }
});

const Character = model('Character', CharacterSchema);

module.exports = Character;
