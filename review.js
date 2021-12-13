import MyMAp from './map';

export default class MyReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate');
    this.map = new MyMAp('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    document.body.addEventListener('click', this.onDocumentClick.bind(this));
  }
  createForm(coords, reviews) {
    //это просто форма в воздухе без координатов,coords пока неизвестен, это лишь заготовка
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('.review-list');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);
    //добавляем к форме доп.атрибут data-coords,где в виде строки будут координаты

    for (const item of reviews) {
      const div = document.createElement('div');
      div.classList.add('review-item');
      div.innerHTML = `
      <div>
        <b> ${{item.name}}</b> [${{item.place}}]
      </div>
      <div> $(item.text) </div>
      `;
reviewList.appendChild(div);
    }

    return root;
  }
  onClick(coords) {
    //эта функция вызовется только после шелчка по карте, а coords это координаты щелчка
    const form = this.createForm(coords);
    // этот this это this.onClick.bind(this)) ????
    this.map.openBalloon(coords, form.innerHtml);
  }
  async onDocumentClick(e) {
    //завязывание на элементы разметки лучше делать через датат атрибуты, так как классы ненадежны и вебпак может их переиначить
    if (e.target.dataset.role === 'review-add') {
      const reviewForm = document.querySelector('[data-role=review-form]');
      const coords = JSON.parse(reviewForm.dataset.coords);
      const data = {
        coords,
        review: {
          name: document.querySelector('[data-role=review-name]').value,
          place: document.querySelector('[data-role=review-place]').value,
          text: document.querySelector('[data-role=review-text]').value,
        },
      };
      this.map.createPlacemark(coords);
      this.map.closeBalloon();
    }
  }
}
