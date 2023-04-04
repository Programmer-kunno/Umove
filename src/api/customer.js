import { 
  post,
  del,
  get
 } from './helper/http';
// import { Request } from './helper/http'

export class CustomerApi {
  static login = async(data) => {
    try {
      const response = await post('/api/customers/login', data);
      return response
    } catch(err) {
      return err
    }
  }

  static async refreshAccess(data) {
    try {
      const response = await post('/api/refresh-token', data)
      return response
    } catch(err) {
      return err
    }
  }

  static async getCustomerData() {
    try {
      const response = await get('/api/customers', {}, false)
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
      const response = await post('/api/reset-password/request', data)
      return response
    } catch(err) {
      return err
    }
  }

  static corporateSignup = async(data) => {
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
        newData.type = newData.mime
        
        formdata.append('company[company_logo]', {uri: newData?.path, name: newData?.name, type: newData?.type })
      }
      
      if(register.bir) {
        const newData = register.bir;
        newData.mimeType = newData.type
        formdata.append('company[company_requirement][bir]', {uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
      }
      
      if(register.dti) {
        const newData = register.dti;
        newData.mimeType = newData.type
        formdata.append('company[company_requirement][dti]', {uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
      }
  
      if(register.validId) {
        const newData = register.validId;
        newData.mimeType = newData.type
        formdata.append('valid_id', {uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
      }
    }

    try {
      const response = await post('/api/customers/register', formdata, { 'Content-Type': 'multipart/form-data '})
      return response
    } catch(err) {
      return err
    }
  }
}