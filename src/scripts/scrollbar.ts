const accents = ['#FF9FC4', '#FF9770', '#FFD670', '#268AF9', '#B1E0FF'];
const color = accents[Math.floor(Math.random() * accents.length)] ?? accents[0];
document.documentElement.style.setProperty('--scrollbar-color', color);

export {};
