import { Component } from '@angular/core';
import { Events, LoadingController, NavController, ViewController, NavParams } from 'ionic-angular';
import * as $ from "jquery";

declare const AMap

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  map: any

  constructor(public events: Events,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
  ) {
    events.subscribe('appExit', () => {
      $('.step-1').css('display', 'none')
      $('.step-2').css('display', 'none')
      $('.step-3').css('display', 'none')
      $('.step-exit').css('display', 'flex')
    });
  }

  ionViewDidLoad() {
    this.map = new AMap.Map('container', {
      resizeEnable: true
    })
  }

  next() {
    $('.step-1').css('display', 'none')
    $('.step-2').css('display', 'flex')
  }
}