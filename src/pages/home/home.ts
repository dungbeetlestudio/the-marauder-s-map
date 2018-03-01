import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';

declare const AMap

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  map: any

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    this.map = new AMap.Map('container', {
      resizeEnable: true
    })
  }
}

