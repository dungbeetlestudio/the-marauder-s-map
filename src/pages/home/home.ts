import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, PopoverController, NavParams, Modal } from 'ionic-angular';

declare const AMap

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  map: any

  constructor(public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    this.map = new AMap.Map('container', {
      resizeEnable: true
    })
  }
}