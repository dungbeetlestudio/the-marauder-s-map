import { Component, enableProdMode } from '@angular/core';
import { Events, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any = HomePage;
  backButtonPressed: boolean

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

//      enableProdMode();
      platform.registerBackButtonAction(() => {
        //双击退出提示框 
        if (this.backButtonPressed) {
          //当触发标志为true时，即2秒内双击返回按键则退出APP
          //this.platform.exitApp();
          //          this.backgroundMode.moveToBackground()
          events.publish('appExit', '', '')
        } else {
          console.log('back')
          this.backButtonPressed = true
          setTimeout(() => this.backButtonPressed = false, 1000)//2秒内没有再次点击返回则将触发标志标记为false
        }
      })
    });
  }
}

