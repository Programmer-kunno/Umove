const environment = "Staging"

const config = {
  "Staging": {
    // url: "http://18.140.182.54"
    // url: "http://localhost:8000"
    url: "https://admin.umove.ph"
  }
}

export default config[environment]