const environment = "Staging"

const config = {
  "Staging": {
    url: "https://admin.umove.ph",
    socketUrl: "wss://admin.umove.ph"
  }
}

export default config[environment]