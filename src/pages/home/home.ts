import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import * as $ from "jquery";
import { Geolocation } from '@ionic-native/geolocation';

declare const AMap

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  timer: any
  locator: any
  coords: any
  map: any

  constructor(public events: Events,
    public navCtrl: NavController,
    public geolocation: Geolocation

  ) {
    events.subscribe('appExit', () => {
      $('.step-exit').css('display', 'flex')
    })

    let watch = this.geolocation.watchPosition()
    this.locator = watch.subscribe(this.locate)
  }

  ionViewDidLoad() {
    //button events
    $('.step-1 .next')[0].onclick = this.next
    $('.step-3 .code')[0].onfocus = () => $('.step-3 .code')[0].value = ''
    $('.step-3 .code')[1].onfocus = () => $('.step-3 .code')[1].value = ''
    $('.step-3 .code')[2].onfocus = () => $('.step-3 .code')[2].value = ''
    $('.step-3 .code')[3].onfocus = () => $('.step-3 .code')[3].value = ''

    $('.step-3 .code')[0].onkeyup = () => {
      if ($('.step-3 .code')[0].value.length > 0)
        $('.step-3 .code')[1].focus()
    }

    $('.step-3 .code')[1].onkeyup = () => {
      if ($('.step-3 .code')[1].value.length > 0)
        $('.step-3 .code')[2].focus()
      else
        $('.step-3 .code')[0].focus()
    }

    $('.step-3 .code')[2].onkeyup = () => {
      if ($('.step-3 .code')[2].value.length > 0)
        $('.step-3 .code')[3].focus()
      else
        $('.step-3 .code')[1].focus()
    }

    $('.step-3 .code')[3].onkeyup = () => {
      if ($('.step-3 .code')[3].value.length > 0)
        $('.step-3').css('display', 'none'), this.signIn()
      else
        $('.step-3 .code')[2].focus()
    }

    $('.atToSelf')[0].onclick = this.atToSelf

    this.map = new AMap.Map('container', {
      viewMode: '3D',
      pitch: 45,
      zoom: 23,
      expandZoomRange: true,
      resizeEnable: true
    })
  }

  next() {
    $('.step-1').css('display', 'none')
    $('.step-2').css('display', 'flex')

    let i = 0
    this.timer = setInterval(() => {
      if (i++ < 15) {
        $('.progress-value').css('width', i * (100 / 15))
      }
      else {
        clearInterval(this.timer)
        $('.step-2').css('display', 'none')
        $('.step-3').css('display', 'flex')
      }
    }, 1000)
  }

  signIn() {
    $('.step-4').css('display', 'flex')

    let i = 2
    this.timer = setInterval(() => {
      $('#step-4-progress-value').attr('class', `progress-value${i % 2 + 1}`)
      i++
    }, 500)

    setTimeout(() => {
      clearInterval(this.timer)
      $('.sign-in').css('display', 'none')
      $('.step-4').css('display', 'none')
      $('.search').css('display', 'flex')
    }, 3000)
  }

  locate(data) {
    // data can be a set of coordinates, or an error (if an error occurred).
    var str = ['successed'];

    str.push('longitude:' + data.coords.longitude);
    str.push('latitude:' + data.coords.latitude);

    document.getElementById('tip').innerHTML = str.join('<br>')

    this.coords = data.coords
    console.log(`[${this.coords.longitude},${this.coords.latitude}]`)
  }

  atToSelf() {
    try {
      this.map.setZoomAndCenter(14, [this.coords.longitude, this.coords.latitude])
    }
    catch (e) {
      console.log(this.map)
      console.log(e)
    }
  }
}
