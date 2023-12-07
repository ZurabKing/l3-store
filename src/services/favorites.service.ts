import localforage from 'localforage';
import { ProductData } from 'types';

const FDB = '__favorites';

class FavoritesService {
  init() {
    this._updFavCounters();
  }

  async addProductToFav(product: ProductData) {
    const products = await this.getFavorites();
    await this.setFavorites([...products, product]);
  }

  async removeProductFromFav(product: ProductData) {
    const products = await this.getFavorites();
    await this.setFavorites(products.filter(({ id }) => id !== product.id));
  }

  async clear() {
    await localforage.removeItem(FDB);
    this._updFavCounters();
  }

  async getFavorites(): Promise<ProductData[]> {
    return (await localforage.getItem(FDB)) || [];
  }

  async setFavorites(data: ProductData[]) {
    await localforage.setItem(FDB, data);
    this._updFavCounters();
  }

  async isInFavorites(product: ProductData) {
    const products = await this.getFavorites();
    return products.some(({ id }) => id === product.id);
  }

  private async _updFavCounters() {
    const products = await this.getFavorites();
    if (products.length < 1) {
      const favLink = document.querySelector('.favoritesLink');
      favLink?.classList.add('is__empty');
    }
  }
}

export const favoritesService = new FavoritesService();
