/// <reference types="@capacitor/local-notifications" />
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ToDoLa',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {"url":"http://192.168.0.26:8100"},
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;



  

