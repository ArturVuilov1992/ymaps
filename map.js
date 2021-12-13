/* eslint-disable no-undef */
export default class MyMap {
  constructor(mapId, onClick) {
    //onClick() нужна для такого,чтобы по любому щедчку на карте открывать форму
    this.mapId = mapId;
    this.onClick = onClick;
  }
  async init() {
    await this.injectYMapsScript();
    await this.loadYMaps();
    this.initMap();
  }
  injectYMapsScript() {
    return new Promise((resolve) => {
      const ymapsScript = document.createElement('script');
      ymapsScript.src =
        'https://api-maps.yandex.ru/2.1/?apikey=5a4c2cfe-31f1-4007-af4e-11db22b6954b&lang=ru_RU';
      document.body.appendChild(ymapsScript);
      ymapsScript.addEventListener('load', resolve);
    });
  }
  loadYMaps() {
    return new Promise((resolve) => ymaps.ready(resolve));
  }
  initMap() {
    this.clusterer = new ymaps.Clusterer({
      groupByCoordinates: true, //Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.
      clusterDisableClickZoom: true /* При клике на диаграмме увеличится масштаб карты и кластер разобьется на одиночные метки, входящие в состав этого кластера. Чтобы отключить это поведение, следует выставить опцию clusterDisableClickZoom в true. В этом случае при клике на диаграмме будет открываться балун. */,
      clusterOpenBalloonOnClick: false,
    });
    this.clusterer.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      // Получение ссылки на координаты объекта, сгенерировавший событие
      this.onClick(coords);
    });
    this.map = new ymaps.Map(this.mapId, {
      center: [55.74, 37.68],
      zoom: 11,
    });
    this.map.events.add('click', (e) => this.onClick(e.get('coords')));
    this.map.geoObjects.add(this.clusterer);
  }
}
