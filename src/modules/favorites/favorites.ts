import html from './favorites.tpl.html';
import { ProductData } from 'types';
import { Component } from '../component';
import { Product } from '../product/product';
import { favoritesService } from '../../services/favorites.service';

class Favorites extends Component {
  products!: ProductData[];

  async render() {
    this.products = await favoritesService.getFavorites();

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: false });
      productComp.render();
      productComp.attach(this.view.list);
    });
  }
}

export const favoritesComp = new Favorites(html);
