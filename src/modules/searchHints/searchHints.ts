import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './searchHints.tpl.html';

import { searchHintsList } from '../../../types';
import { formatProductNamesForHref } from '../../utils/helpers';

export class SearchHints {
  view: View;
  searchHintsNames: searchHintsList;
  private readonly CATALOG_URL = 'https://www.wildberries.ru/catalog/0/search.aspx?search=';

  constructor() {
    this.view = new ViewTemplate(html).cloneView();

    this.searchHintsNames = [];
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
  }

  //При измененни подсказок, обновляем их и перерендериваем
  update(searchHintsNames: searchHintsList) {
    this.searchHintsNames = searchHintsNames;
    this.render();
  }

  render() {
    //TODO: Перенести в utils
    const hrefsProductsNames = formatProductNamesForHref(this.searchHintsNames);

    //TODO: Убрать вложенность,брать элементы через цикл for
    this.view.hintFirst.innerHTML = this.searchHintsNames[0].productName;
    this.view.hintFirst.setAttribute('href', `${this.CATALOG_URL} + ${hrefsProductsNames[0]}`);
    this.view.hintSecond.innerHTML = this.searchHintsNames[1].productName;
    this.view.hintSecond.setAttribute('href', `${this.CATALOG_URL} + ${hrefsProductsNames[1]}`);
    this.view.hintThird.innerHTML = this.searchHintsNames[2].productName;
    this.view.hintThird.setAttribute('href', `${this.CATALOG_URL} + ${hrefsProductsNames[3]}`);
  }
}
