/*!
 * Team. Develable
 * Whatever you imagine, We develop.
 * Since 2018.07.06
 *
 * Copyright 2018-2021 Develable.
 */

let telltext = [
    {
        "text01": "It's a beautiful day outside.\n\nbirds are singing,\nflowers are blooming.\n\non days like these, kids like you\n\n",
        "text02": "Should be burning in hell"
    }
]

function sanstell(cycle) {
    cycle = 0;

    if (typeof console._commandLineAPI !== 'undefined') {
        console.API = console._commandLineAPI;
    } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
        console.API = console._inspectorCommandLineAPI;
    } else if (typeof console.clear !== 'undefined') {
        console.API = console;
    }
    console.API.clear()
    console.log(`██████████▀▀▀▀▀▀▀▀▀▀▀▀▀██████████\n█████▀▀░░░░░░░░░░░░░░░░░░░▀▀█████\n███▀░░░░░░░░░░░░░░░░░░░░░░░░░▀███\n██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██\n█░░░░░░▄▄▄▄▄▄░░░░░░░░▄▄▄▄▄▄░░░░░█\n█░░░▄██▀░░░▀██░░░░░░██▀░░░▀██▄░░█\n█░░░██▄░░▀░░▄█░░░░░░█▄░░▀░░▄██░░█\n██░░░▀▀█▄▄▄██░░░██░░░██▄▄▄█▀▀░░██\n███░░░░░░▄▄▀░░░████░░░▀▄▄░░░░░███\n██░░░░░█▄░░░░░░▀▀▀▀░░░░░░░█▄░░░██\n██░░░▀▀█░█▀▄▄▄▄▄▄▄▄▄▄▄▄▄▀██▀▀░░██\n███░░░░░▀█▄░░█░░█░░░█░░█▄▀░░░░███\n████▄░░░░░░▀▀█▄▄█▄▄▄█▄▀▀░░░░▄████\n███████▄▄▄▄░░░░░░░░░░░░▄▄▄███████\n==================================\n${telltext[cycle].text01}\n%c${telltext[cycle].text02}`, "background: red; color: yellow; font-size: x-large; font-weight:bold;");
}