export const returnIcon = (type) => {
  switch(type.toLowerCase()) {
    case "motorcycle":
      return require('../assets/vehicles/motor_nobg.png');
    case "truck":
      return require('../assets/vehicles/exclusive_nobg.png');
    case "ship":
      return require('../assets/vehicles/ship_nobg.png');
    default:
      return require('../assets/vehicles/motor_nobg.png');
  }
}

export const UMIcons = {
  welcomeBG: require('../assets/bg/welcome-start.png'),
  mainLogo: require('../assets/logo/logo-primary.png'),
  truckIcon: require('../assets/truck/exclusive.png'),
  individualStartIcon: require('../assets/start/individual-icon.png'),
  corporateStartIcon: require('../assets/start/corporate-icon.png'),
  quickQuoteStartIcon: require('../assets/start/quickquote-icon.png'),
  loginStartIcon: require('../assets/start/login-icon.png'),
  truckStartIcon: require('../assets/start/truck.png'),
  shipStartIcon: require('../assets/start/ship.png'),
  motorStartIcon: require('../assets/start/ride-motor.png'),
  exitIcon: require('../assets/icons/exit.png'),
  userBlankProfile: require('../assets/user/user-blank.png'),
  profilePicIcon: require('../assets/icons/profile-pic.png'),
  //Profile Drawer
  homeWalletIcon: require('../assets/drawer/UMoveWalletIcon.png'),
  transactionIcon: require('../assets/drawer/history.png'),
  addressIcon: require('../assets/drawer/location.png'),
  voucherIcon: require('../assets/drawer/voucher.png'),
  questionIcon: require('../assets/drawer/question.png'),
  helpIcon: require('../assets/drawer/about.png'),
  settingsIcon: require('../assets/drawer/setting.png'),
  //Social Acct
  googleIcon: require('../assets/socials/google.png'),
  facebookIcon: require('../assets/socials/facebook.png'),
  appleIcon: require('../assets/socials/apple.png'),
  //Icons
  sentIcon: require('../assets/icons/sent.png'),
  tagIcon: require('../assets/icons/tag-icon.png'),
  backIcon: require('../assets/icons/arrow-back.png'),
  locationIcon: require('../assets/icons/location-icon.png'),
  backIconOrange: require('../assets/icons/arrow-back-orange.png'),
  orangePlusIcon: require('../assets/icons/orange-plus-icon.png'),
  quickQuotateIcon: require('../assets/icons/quick-quote-btn.png'),
  headsetIcon: require('../assets/icons/headset.png'),
  cloudErrorIcon: require('../assets/icons/cloud-error.png'),
  whitePencil: require('../assets/icons/pencil.png'),
  greenCheck: require('../assets/icons/green-check.png'),
  burgerMenuIcon: require('../assets/icons/sideMenu.png'),
  xIcon: require('../assets/icons/x-icon.png'),
  // Error Icons
  warningSign: require('../assets/errors/warning-sign.png')
}
