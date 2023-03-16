import { 
  post,
  del
 } from './helper/http';
// import { Request } from './helper/http'
import { getRefreshToken } from './helper/userHelper';
import { dispatch } from '../utils/redux';
import { updateUserAccess, userLogout } from '../redux/actions/User';
import { resetNavigation } from '../utils/navigationHelper';
import environtment from './environtment';


const baseURL = environtment.url

let isRefresing = false;

export class CustomerApi {
  static login = async(data) => {
    try {
      const response = await post('/api/customers/login', data);
      return response.data
    } catch(err) {
      return err.data
    }
  }

static async refreshAccess(callback) {
  try {
    if(isRefresing){
      return setTimeout(() => {
        this.refreshAccess(callback)
      })
    }

    isRefresing = true;
    const userRefreshToken = getRefreshToken();
    const response = await post('/api/refresh-token', { refresh: userRefreshToken })
    if(response.data.success){
      dispatch(updateUserAccess(response.data.data.access))
      callback()
      isRefresing = false
    } 
  } catch(err) {
    isRefresing = false;
    const userRefreshToken = getRefreshToken();
    if(err.success = false && userRefreshToken) {
      dispatch(userLogout())
      resetNavigation('Start1')
    }
  }
}

  static async deleteUser(data) {
    try {
      const response = await del('/api/customers/delete/2', data)
      return response.data
    } catch(err) {
      return err.data
    }
  }

  static async individualSignup(data) {
    let API_URL = baseURL + '/api/customers/register';
    let register = data
    let formdata = new FormData();

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
    // formdata.append('user[user_profile][profile_image]', {uri: img.uri, name: img.name, type: img.type);
    
    let res = await fetch(API_URL ,{
      method: 'POST',
      headers: {
              Accept: 'application/json',
              "Content-Type": "multipart/form-data",
          },
      body: formdata
    });
    return res.json()
  }

  static corporateSignup = async(data) => {
    const register = data
    const formdata = new FormData();

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

    try {
      const response = await post('/api/customers/register', formdata, { 'Content-Type': 'multipart/form-data '})
      return response.data
    } catch(err) {
      return err.data
    }
  }
}