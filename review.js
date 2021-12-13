import MyMAp from './map';

export default class MyReview {
  constructor() {
    this.map = new MyMAp('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    //..
  }
  onClick(coords) {
    //..
  }
}
