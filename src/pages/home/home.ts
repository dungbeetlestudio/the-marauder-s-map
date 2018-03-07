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
      $('.step-exit').css('display', 'flex')
    })
  }

  ionViewDidLoad() {
    this.map = new AMap.Map('container', {
      resizeEnable: true
    })

    $('.step-1 .phone-numbers').keyup(() => {

    })

    $('.step-3 .code').keyup(() => {

    })
  }

  next() {
    $('.step-1').css('display', 'none')
    $('.step-2').css('display', 'flex')

    let i = 0
    let timer = setInterval(() => {
      if (i++ < 3) {
        $('.step-2 .progress').text(`${15 - i} seconds`)
        console.log(i)
      }
      else {
        clearInterval(timer)
        $('.step-2').css('display', 'none')
        $('.step-3').css('display', 'flex')
      }
    }, 1000)

  }
}
