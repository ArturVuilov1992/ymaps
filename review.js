import MyMAp from './map';

export default class MyReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate');
    this.map = new MyMAp('map', this.onClick.bind(this)); //создаем экземпляр// this.onClick.bind(this)) такая запись чтобы работал в обоих классах
    this.map.init().then(this.onInit.bind(this));
  }

  onClick(coords) {
    const reviews = localStorage.getItem(JSON.stringify(coords)); //здесь мы достаем уже сохраненные отзывы по координатам coords если они есть
    //эта функция вызовется только после шелчка по карте, а coords это координаты щелчка
    const form = this.createForm(coords, reviews);
    this.map.openBalloon(coords, form.innerHtml);
  }

  createForm(coords, reviews) {
    //это просто форма в воздухе без координатов,coords пока неизвестен, это лишь заготовка
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('.review-list'); //накопитель
    const reviewForm = root.querySelector('[data-role=review-form]'); // сама форма

    reviewForm.dataset.coords = JSON.stringify(coords); //закавычиваем координаты сразу для формата локал сторэдж чтобы ниже сделать их ключом и связать с отзывами
    //добавляем к форме доп.атрибут data-coords,где в виде строки будут координаты
    const prevReviews = JSON.parse(reviews);

    for (const item in prevReviews) {
      //цикл не работает если пусто
      const div = document.createElement('div');
      /*       div.classList.add('review-item');
       */ div.innerHTML = `
      <div>
        <b> ${item.name}</b> [${item.place}]
      </div>
      <div> ${item.text} </div>
      `;
      reviewList.appendChild(div);
    }

    return root;
  }

  async onInit() {
    document.body.addEventListener('click', this.onDocumentClick.bind(this));
  }
  async onDocumentClick(e) {
    //завязывание на элементы разметки лучше делать через датат атрибуты, так как классы ненадежны и вебпак может их переиначить
    if (e.target.dataset.role === 'review-add') {
      const reviewForm = document.querySelector('[data-role=review-form]'); //форма

      const data = {
        name: document.querySelector('[data-role=review-name]').value,
        place: document.querySelector('[data-role=review-place]').value,
        text: document.querySelector('[data-role=review-text]').value,
      };
      localStorage.setItem(reviewForm.dataset.coords, JSON.stringify(data));
      // eslint-disable-next-line no-undef
      this.map.createPlacemark();
      this.map.closeBalloon();
    }
  }
}
