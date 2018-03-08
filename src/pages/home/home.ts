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

    $('.phone-numbers').focus()
  }

  next() {
    $('.step-1').css('display', 'none')
    $('.step-2').css('display', 'flex')

    let i = 0
    let timer = setInterval(() => {
      if (i++ < 1) {
        $('.step-2 .progress').text(`${15 - i} seconds`)
      }
      else {
        clearInterval(timer)
        $('.step-2').css('display', 'none')
        $('.step-3').css('display', 'flex')

        $('.step-3 .code')[0].onkeyup = () => { $('.step-3 .code')[1].focus() }
        $('.step-3 .code')[1].onkeyup = () => { $('.step-3 .code')[2].focus() }
        $('.step-3 .code')[2].onkeyup = () => { $('.step-3 .code')[3].focus() }
        $('.step-3 .code')[3].onkeyup = () => { $('.sign-in').css('display', 'none') }
        $('.step-3 .code')[0].focus()
      }
    }, 1000)

  }
}
