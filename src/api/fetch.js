import { 
  get,
 } from './helper/http'

export class FetchApi {
  static async companyTypes() {
    try {
      const response = await get('/api/companies/types')
      return response.data
    } catch(err) {
      return err
    }
  }

  static async regions() {
    try {
      const response = await get('/api/regions', {}, true);
      return response.data
    } catch(err) {
      return err
    }
  }

  static async provinces(regionCode) {
    try {
      const response = await get('/api/provinces/' + regionCode, {}, true);
      return response.data
    } catch(err) {
      return err
    }
  }

  static async cities(provinceCode) {
    try {
      const response = await get('/api/cities/' + provinceCode, {}, true);
      return response.data
    } catch(err) {
      return err
    }
  }

  static async barangays(cityCode) {
    try {
      const response = await get('/api/barangays/' + cityCode, {}, true);
      return response.data
    } catch(err) {
      return err
    }
  }

  static async typesOfGoods() {
    try {
      const response = await get('/api/products/types', {}, true);
      return response.data
    } catch(err) {
      return err
    }
  }

  static async productCategories(productType) {
    try {
      const response = await get('/api/products/categories?' + productType, {}, true);
      return response.data
    } catch(err) {
      return err
    }
  }

  static async productSubcategories(productCategory) {
    try {
      const response = await get('/api/products/subcategories?' + productCategory, {}, true);
      return response.data
    } catch(err) {
      return err
    }
  }

  static async packagingTypes() {
    try {
      const response = await get('/api/products/uom', {}, true);
      return response.data
    } catch(err) {
      return err
    }
  }
}