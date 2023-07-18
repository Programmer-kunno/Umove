import { 
  post,
  del,
  get,
  patch
 } from './helper/http';
// import { Request } from './helper/http'

export class CustomerApi {
  static login = async(data) => {
    try {
      const response = await post('/api/customers/login', data, {}, false);
      return response
    } catch(err) {
      return err
    }
  }

  static async refreshAccess(data) {
    try {
      const response = await post('/api/refresh-token', data, {}, true)
      return response
    } catch(err) {
      return err
    }
  }

  //the token is optional
  static async getCustomerData(optionalToken) {
    try {
      const response = await get('/api/customers/', {}, false, optionalToken)
      return response
    } catch(err) {
      return err
    }
  }

  static async getSavedAddresses() {
    try {
      const response = await get('/api/customers/addresses', {}, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async createSavedAddresses(data) {
    try {
      const response = await post('/api/customers/addresses/create', data, {}, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async updateSavedAddresses(addressID, data) {
    try {
      const response = await patch(`/api/customers/addresses/update/${addressID}`, data)
      return response
    } catch(err) {
      return err
    }
  }

  static async deleteSavedAddress(addressID) {
    try {
      const response = await del(`/api/customers/addresses/delete/${addressID}`)
      return response
    } catch(err) {
      return err
    }
  }

  static async requestOTP(data, tokenData) {
    try {
      const response = await post(`/api/customers/request-otp`, data, {}, true, tokenData)
      return response
    } catch(err) {
      return err
    }
  }

  static async verifyOTP(data, tokenData) {
    try {
      const response = await post(`/api/customers/verify-otp`, data, {}, true, tokenData)
      return response
    } catch(err) {
      return err
    }
  }

  static async updateCustomer(data, customerType, accountNumber) {
    const formdata = new FormData();

      formdata.append('customer_type', customerType);
      if(data.profilePicture) {
        const newData = data.profilePicture;
        newData.mimeType = newData.type
        formdata.append('user[user_profile][profile_image]', { uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
      }
      if(data.username){
        formdata.append('user[username]', data.username);
      }
      if(data.firstName && data.lastName){
        formdata.append('user[user_profile][first_name]', data.firstName);
        formdata.append('user[user_profile][middle_name]', data.middleName);
        formdata.append('user[user_profile][last_name]', data.lastName);
      }
      if(data.mobileNumber){
        formdata.append('user[user_profile][mobile_number]', data.mobileNumber);
      }
      if(data.email){
        formdata.append('user[user_profile][email]', data.email);
      }
      if(data.address && data.region && data.province && data.city && data.barangay && data.zipCode){
        formdata.append('user[user_profile][address]', data.address);
        formdata.append('user[user_profile][region]', data.region);
        formdata.append('user[user_profile][province]', data.province);
        formdata.append('user[user_profile][city]', data.city);
        formdata.append('user[user_profile][barangay]', data.barangay);
        formdata.append('user[user_profile][zip_code]', data.zipCode);
      }
      if(data.validID) {
        const newData = data.validID;
        newData.mimeType = newData.type
        formdata.append('valid_id', { uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
      }
      if(data.companyLogo) {
        const newData = data.companyLogo;
        newData.mimeType = newData.type
        formdata.append('company[company_logo]', { uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
      }
      if(data.bir) {
        const newData = data.bir;
        newData.mimeType = newData.type
        formdata.append('company[company_requirement][bir]', { uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
      }
      if(data.dti) {
        const newData = data.dti;
        newData.mimeType = newData.type
        formdata.append('company[company_requirement][dti]', { uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
      }
      if(data.companyEmail){
        formdata.append('company[company_email]', data.companyEmail)
      }
      if(data.companyName){
        formdata.append('company[company_name]', data.companyName)
      }
      if(data.companyMobileNumber){
        formdata.append('company[company_mobile_number]', data.companyMobileNumber)
      }
      if(data.officeAddress && data.officeRegion && 
        data.officeProvince && data.officeCity && 
        data.officeBarangay && data.officeZipCode){
          formdata.append('company[office_address]', data.officeAddress);
          formdata.append('company[office_region]', data.officeRegion);
          formdata.append('company[office_province]', data.officeProvince);
          formdata.append('company[office_city]', data.officeCity);
          formdata.append('company[office_barangay]', data.officeBarangay);
          formdata.append('company[office_zip_code]', data.officeZipCode);
      }

    try {
      const response = await patch(`/api/customers/update/${accountNumber}`, formdata, { 'Content-Type': 'multipart/form-data '})
      return response
    } catch(err) {
      return err
    }
  }

  static async getNotification() {
    try {
      const response = await get('/api/notifications', {}, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async deleteUser(data) {
    try {
      const response = await del('/api/customers/delete/2', data)
      return response
    } catch(err) {
      return err
    }
  }

  static async resetPassword(data) {
    try {
      const response = await post('/api/reset-password/request', data, {}, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async validateUser(data) {
    try {
      const response = await post('/api/users/validate', data, {}, false)
      return response
    } catch(err) {
      return err
    }
  }

  static signUp = async(data) => {
    const register = data
    const formdata = new FormData();

    if(register.customerType == 'individual') {

      formdata.append('customer_type', register.customerType);
      formdata.append('billing_type', "per_booking");
      formdata.append('charge_type', "per_vehicle")
      formdata.append('user[username]', register.username);
      formdata.append('user[password]', register.password);
      formdata.append('user[password2]', register.confirmPassword);
      formdata.append('user[user_profile][first_name]', register.firstName);
      formdata.append('user[user_profile][middle_name]', register.middleName);
      formdata.append('user[user_profile][last_name]', register.lastName);
      formdata.append('user[user_profile][mobile_number]', register.mobileNumber);
      formdata.append('user[user_profile][email]', register.email);
      formdata.append('user[user_profile][address]', register.streetAddress);
      formdata.append('user[user_profile][region]', register.region);
      formdata.append('user[user_profile][province]', register.province);
      formdata.append('user[user_profile][city]', register.city);
      formdata.append('user[user_profile][barangay]', register.barangay);
      formdata.append('user[user_profile][zip_code]', register.zipcode);

    } else {

      formdata.append('customer_type', register.customerType);
      formdata.append('billing_type', "per_soa");
      formdata.append('charge_type', "per_vehicle")
      formdata.append('user[username]', register.username);
      formdata.append('user[password]', register.password);
      formdata.append('user[password2]', register.confirmPassword);
      formdata.append('user[user_profile][first_name]', register.firstName);
      formdata.append('user[user_profile][middle_name]', register.middleName);
      formdata.append('user[user_profile][last_name]', register.lastName);
      formdata.append('user[user_profile][mobile_number]', register.mobileNumber);
      formdata.append('user[user_profile][email]', register.email);
      formdata.append('user[user_profile][address]', register.streetAddress);
      formdata.append('user[user_profile][region]', register.region);
      formdata.append('user[user_profile][province]', register.province);
      formdata.append('user[user_profile][city]', register.city);
      formdata.append('user[user_profile][barangay]', register.barangay);
      formdata.append('user[user_profile][zip_code]', register.zipcode);
      // formdata.append('user[user_profile][profile_image]', {uri: img.uri, name: img.name, type: register.);
      formdata.append('company[company_name]', register.companyName)
      formdata.append('company[company_address]', register.companyAddress)
      formdata.append('company[company_mobile_number]', register.companyMobileNumber)
      formdata.append('company[company_email]', register.companyEmail)
      formdata.append('company[office_address]', register.officeAddress)
      formdata.append('company[office_region]', register.officeRegion)
      formdata.append('company[office_province]', register.officeProvince)
      formdata.append('company[office_city]', register.officeCity)
      formdata.append('company[office_barangay]', register.officeBarangay)
      formdata.append('company[office_zip_code]', register.officeZipcode)
      if(register.companyLogo) {
        const newData = register.companyLogo;
        formdata.append('company[company_logo]', {uri: newData?.path, name: newData?.name, type: newData?.type })
      }
      
      if(register.bir) {
        const newData = register.bir;
        formdata.append('company[company_requirement][bir]', {uri: newData?.uri, name: newData?.name, type: newData?.type })
      }
      
      if(register.dti) {
        const newData = register.dti;
        formdata.append('company[company_requirement][dti]', {uri: newData?.uri, name: newData?.name, type: newData?.type })
      }
  
      if(register.validId) {
        const newData = register.validId;
        formdata.append('valid_id', {uri: newData?.uri, name: newData?.name, type: newData?.type })
      }
    }

    try {
      const response = await post('/api/customers/register', formdata, { 'Content-Type': 'multipart/form-data '}, false)
      return response
    } catch(err) {
      return err
    }
  }
}