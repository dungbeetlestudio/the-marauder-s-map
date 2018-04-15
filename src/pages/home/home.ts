import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage'
import { Keyboard } from '@ionic-native/keyboard'

import * as ctf from 'coordtransform'
import * as qs from 'querystring'
import * as http from 'ajax'
import * as $ from 'jquery'

declare const AMap

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  timer: any
  locator: any
  coords: any = { longitude: 0, latitude: 0 }
  map: any
  marker: any
  phoneNumber: any
  password: any

  constructor(public events: Events,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public storage: Storage,
    public keyboard: Keyboard
  ) {
    events.subscribe('appExit', () => {
      $('.step-exit').css('display', 'flex')
    })

    let watch = this.geolocation.watchPosition()
    this.locator = watch.subscribe(this.locate.bind(this))
  }

  async ionViewDidLoad() {
    //button events
    $('.step-1 .next')[0].onclick = this.next.bind(this)
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

    $('.atSelf')[0].onclick = this.atSelf.bind(this) // object

    let signIn = await this.storage.get('user')
    console.log(signIn)

    if (!signIn) {
      console.log('上一次没有登陆')
      this.displaySign()
    }
    else {
      // let rs = await $.get(`http://127.0.0.1/prove?${qs.stringify({
      //   account: this.phoneNumber,
      //   password: this.password
      // })}`)

      if (true) {
        console.log('登陆成功')
        await this.storage.set('user', { phoneNumber: this.phoneNumber, password: this.password })
        //   this.displayHome()
      } else {
        // console.log('登陆失败')
      }
    }

    try{
    this.map = new AMap.Map('container', {
      zoom: 23,
      expandZoomRange: true,
      resizeEnable: true,
      center: [112.90793486290448, 28.203039376444476]
    })
  }catch(e){console.log(e)}

    this.marker = new AMap.Marker({
      content: `<div class= "people">
          <div class="say">
          <em></em><span></span>
          <div class="says"> That's&nbsp;a&nbsp;big&nbsp;Twinkie.</div>
          </div>
          <img class= "head-portrait" src = "assets/img/winston.jpg" />
          </div>`,
      map: this.map
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

        this.keyboard.show()
        $('.step-3 .code')[0].focus()
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
      this.displayHome()
    }, 3000)
  }

  async locate(data) {
    // data can be a set of coordinates, or an error (if an error occurred).
    var str = ['successed'];

    str.push('longitude:' + data.coords.longitude);
    str.push('latitude:' + data.coords.latitude);

    document.getElementById('tip').innerHTML = str.join('<br>')
    this.coords = data.coords

    // var rs = await http.get(`http://127.0.0.1/self?_id=182123&value=222`)
    // console.log(rs.body)

    // rs = await http.get(`http://127.0.0.1/others?${qs.stringify({ _id: ['182131'] })}`)
    // console.log(rs.body)
  }

  atSelf() {
    var wgs84togcj02 = ctf.wgs84togcj02(this.coords.longitude, this.coords.latitude);
    console.log(wgs84togcj02)

    //  this.map.setCenter(wgs84togcj02)
    //  this.marker.setPosition(wgs84togcj02)
  }

  displaySign() {
    $('.sign-in').css('display', 'flex')
    $('.step-1').css('display', 'flex')
    $('.search').css('display', 'none')
    $('.actions').css('display', 'none')

    this.keyboard.show()
    $('.phone-numbers')[0].focus()
  }

  displayHome() {
    $('.sign-in').css('display', 'none')
    $('.step-4').css('display', 'none')
    $('.search').css('display', 'flex')
    $('.actions').css('display', 'flex')
  }
}
