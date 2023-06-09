import { 
  get,
 } from './helper/http'

export class FetchApi {

  static async PaymentsHistory() {
    try {
      const response = await get('/api/payments', {}, false)
      return response
    } catch (err) {
      return err
    }
  }

  static async helpCategories() {
    try {
      const response = await get('/api/settings/help-center/categories', {}, true)
      return response
    } catch (err) {
      return err
    }
  }

  static async helpList(categoryNumber, keyword) {
    try {
      const response = await get(`/api/settings/help-center?category=${categoryNumber}`, {}, true)
      return response
    } catch (err) {
      return err
    }
  }

  static async companyTypes() {
    try {
      const response = await get('/api/companies/types')
      return response
    } catch(err) {
      return err
    }
  }

  static async regions() {
    try {
      const response = await get('/api/regions', {}, true);
      return response
    } catch(err) {
      return err
    }
  }

  static async provinces(regionCode) {
    try {
      const response = await get('/api/provinces/' + regionCode, {}, true);
      return response
    } catch(err) {
      return err
    }
  }

  static async cities(provinceCode) {
    try {
      const response = await get('/api/cities/' + provinceCode, {}, true);
      return response
    } catch(err) {
      return err
    }
  }

  static async barangays(cityCode) {
    try {
      const response = await get('/api/barangays/' + cityCode, {}, true);
      return response
    } catch(err) {
      return err
    }
  }

  static async typesOfGoods() {
    try {
      const response = await get('/api/products/types', {}, true);
      return response
    } catch(err) {
      return err
    }
  }

  static async productCategories(productType) {
    try {
      const response = await get('/api/products/categories?' + productType, {}, true);
      return response
    } catch(err) {
      return err
    }
  }

  static async productSubcategories(productCategory) {
    try {
      const response = await get('/api/products/subcategories?' + productCategory, {}, true);
      return response
    } catch(err) {
      return err
    }
  }

  static async packagingTypes() {
    try {
      const response = await get('/api/products/uom', {}, true);
      return response
    } catch(err) {
      return err
    }
  }

  static async getVehicles() {
    try {
      const response = await get('/api/vehicles/types', {}, true)
      return response
    } catch(err) {
      return err
    }
  }
}