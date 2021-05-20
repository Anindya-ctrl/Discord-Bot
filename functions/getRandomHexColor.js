const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

const getRandomIndex = () => {
    return Math.floor(Math.random() * hex.length);
}

function getRandomHexColor() {
    let hexColor = '#';

    for(let i = 0; i < 6; i++) {
        hexColor += hex[getRandomIndex()];
    }

    return hexColor;
}

module.exports = getRandomHexColor;
