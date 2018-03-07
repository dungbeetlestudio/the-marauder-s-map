import { Component } from '@angular/core';
import { LoadingController, NavController, ViewController, NavParams } from 'ionic-angular';
import * as $ from "jquery";

declare const AMap

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  map: any

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    this.map = new AMap.Map('container', {
      resizeEnable: true
    })

  }

  next() {
    $('.step-1').css('display', 'none')
    $('.step-2').css('display', 'none')
    $('.step-3').css('display', 'flex')
  }
}