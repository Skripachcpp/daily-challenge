let files = {
  "/Download/daily-challenge.xml":
    '<day date="12.04.2022" вт>\n' +
    "<life>выдал наде задачку на разработку</life>\n" +
    "<life>сходил на рынок узнал можно ли попилить щиты</life>\n" +
    '<life time="19:40">пошел кататься на сноуборде</life>\n' +
    "<body>наконец то пришу что то для daily-challenge, чувтвую прилив сил</body>\n" +
    '<life fr="17:20" to="17:40">попереписывался с Никитой, он приедет в москву, надо бы поискать запасной ключ</life>\n' +
    "<live>поболтал с Никитой, обсудили другие страны, он еще в Питере, зовет в гости .. не особо активно но все равно приятно</live>\n" +
    "<body>нормально, отоспаться помогло</body>\n" +
    "</day>\n" +
    '<day date="11.04.2022" пн>\n' +
    "<life>развесил вещи</life>\n" +
    "<live>поболтал с Катей</live>\n" +
    "<body>{фигово}, не стоило так напрягаться вчера</body>\n" +
    "<body>лег спать пораньше</body>\n" +
    "</day>\n" +
    '<day date="10.04.2022" вс>\n' +
    "<life>уборка, отдраил квартиру</life>\n" +
    "</day>\n" +
    '<day date="09.04.2022" сб>\n' +
    "<live>пошел гулять с Настей Инженером, погуляли, посидели в баре</live>\n" +
    "</day>",
};

export async function readFile(path, filename) {
  return files[path + "/" + filename];
}

export async function saveFile(path, filename, text) {
  files[path + "/" + filename] = text;
}
