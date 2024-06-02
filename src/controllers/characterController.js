const Character = require('../models/Character');

const getCharactersByType = async (type) => {
    const characters = await Character.find({ type });
    return characters.map(c => c.character); // Retornar apenas os caracteres
};

const getCharacterInfo = async (char) => {
    const character = await Character.findOne({ character: char });
    if (character) {
        return `${character.character} é ${character.romaji} em ${character.type}`;
    } else {
        return 'Caractere não encontrado.';
    }
};

const quiz = async (message, type) => {
    const characters = await getCharactersByType(type);
    let correctAnswers = 0;
    let totalQuestions = 0;
    let quizActive = true;

    const askQuestion = async () => {
        if (characters.length === 0 || !quizActive) {
            const accuracy = (correctAnswers / totalQuestions) * 100 || 0;
            if (totalQuestions > 0) {
                if (totalQuestions === 1) {
                    message.channel.send(`Quiz concluído! \nVocê acertou ${correctAnswers} de ${totalQuestions} questão. \nPrecisão: ${accuracy.toFixed(2)}%`);
                } else {
                    message.channel.send(`Quiz concluído! \nVocê acertou ${correctAnswers} de ${totalQuestions} questões. \nPrecisão: ${accuracy.toFixed(2)}%`);
                }
            } else {
                message.channel.send('Quiz concluído! Você não acertou nenhuma questão.');
            }
            return;
        }

        const randomIndex = Math.floor(Math.random() * characters.length);
        const currentCharacter = characters[randomIndex];
        const characterData = await Character.findOne({ character: currentCharacter });

        message.channel.send(`Qual o significado do caractere '${currentCharacter}'?`);

        const filter = response => response.author.id === message.author.id;

        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(async collected => {
                const answer = collected.first().content.trim();
                if (answer.toLowerCase() === '!sair') {
                    quizActive = false;
                    const accuracy = (correctAnswers / totalQuestions) * 100 || 0;
                    if (totalQuestions === 1) {
                        message.channel.send(`Quiz encerrado a pedido do usuário. \nVocê acertou ${correctAnswers} de ${totalQuestions} questão. \nPrecisão: ${accuracy.toFixed(2)}%`);
                    } else {
                        message.channel.send(`Quiz encerrado a pedido do usuário. \nVocê acertou ${correctAnswers} de ${totalQuestions} questões. \nPrecisão: ${accuracy.toFixed(2)}%`);
                    }
                    return;
                } else {
                    totalQuestions++;
                    if (answer.toLowerCase() === characterData.romaji.toLowerCase()) {
                        message.channel.send('Correto!');
                        correctAnswers++;
                    } else {
                        message.channel.send(`Incorreto! A resposta era: ${characterData.romaji}`);
                    }
                    characters.splice(randomIndex, 1);
                    await askQuestion();
                }
            })
            .catch(() => {
                const accuracy = (correctAnswers / totalQuestions) * 100 || 0;
                if (totalQuestions === 1) {
                    message.channel.send(`Tempo esgotado! Quiz encerrado. \nVocê acertou ${correctAnswers} de ${totalQuestions} questão. \nPrecisão: ${accuracy.toFixed(2)}%`);
                } else {
                    message.channel.send(`Tempo esgotado! Quiz encerrado. \nVocê acertou ${correctAnswers} de ${totalQuestions} questões. \nPrecisão: ${accuracy.toFixed(2)}%`);
                }
            });
    };

    await askQuestion();
};

module.exports = {
    getCharactersByType,
    getCharacterInfo,
    quiz
};
