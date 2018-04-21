import { Component } from '@angular/core';
import { Events, NavController, Content } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage'
import { Keyboard } from '@ionic-native/keyboard'
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

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
  phoneNumberList = []
  displayNameList = {}
  peoples = {}

  constructor(public events: Events,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public storage: Storage,
    public keyboard: Keyboard,
    public contacts: Contacts

  ) {
    events.subscribe('appExit', () => {
      $('.step-exit').css('display', 'flex')
    })

    this.contacts.find(['displayName', 'phoneNumbers', 'photos'], { hasPhoneNumber: true }).then((others) => {
      for (var k in others) {
        for (var j in others[k].phoneNumbers) {
          let p = others[k].phoneNumbers[j].value.replace(/\s/g, '')
          this.phoneNumberList.push(p)
          this.displayNameList[p] = others[k].displayName
        }
      }
    }).catch((error) => {
      console.log(error)
    })
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

    if (!signIn) {
      console.log('上一次没有登陆')
      this.displaySign()
    }
    else {
      this.phoneNumber = signIn.phoneNumber
      this.password = signIn.password
      let rs = await http.get(`http://sltruman.xicp.net:49549/prove?_id=${this.phoneNumber}&password=${this.password}`)
      console.log(rs.body)

      if (rs.body) {
        console.log('登陆成功')
        this.displayHome()
      } else {
        console.log('登陆失败')
        await this.storage.remove('user')
        this.displaySign()
      }
    }

    this.ionViewDidLoad2()
  }

  async ionViewDidLoad2() {

    let p = await this.geolocation.getCurrentPosition()
    this.coords = p.coords
    let wgs84togcj02 = ctf.wgs84togcj02(this.coords.longitude, this.coords.latitude);

    this.map = new AMap.Map('container', {
      zoom: 23,
      expandZoomRange: true,
      resizeEnable: true,
      center: wgs84togcj02
    })

    this.marker = new AMap.Marker({
      content: `<div class= "people">
          <div class="say">
          <em></em><span></span>
          <div class="says"><center>我</center></div>
          </div>
          <img class= "head-portrait" src = "assets/img/winston.jpg" />
          </div>`,
      map: this.map,
      visible: true,
      position: wgs84togcj02
    })

    for (var k in this.phoneNumberList) {
      this.peoples[this.phoneNumberList[k]] = new AMap.Marker({
        content: `<div class= "people">
            <div class="say">
            <em></em><span></span>
            <div class="says p${this.phoneNumberList[k]}"><center>${this.displayNameList[this.phoneNumberList[k]]}</center></div>
            </div>
            <img class="head-portrait" src="assets/img/winston.jpg" />
            </div>`,
        map: this.map,
        visible: false
      })
    }
  }

  async next() {
    this.phoneNumber = $('.phone-numbers')[0].value

    let rs = await http.get(`http://sltruman.xicp.net:49549/verify?_id=${this.phoneNumber}`)
    if (!rs.body) {
      alert(`请求验证码失败！`)
      return
    }


    $('.step-1').css('display', 'none')
    $('.step-2').css('display', 'flex')

    let i = 0
    this.timer = setInterval(() => {
      if (i++ < 40) {
        $('.progress-value').css('width', i * (100 / 40))
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

  async signIn() {
    $('.step-4').css('display', 'flex')

    this.password = $('.step-3 .code')[0].value
    this.password += $('.step-3 .code')[1].value
    this.password += $('.step-3 .code')[2].value
    this.password += $('.step-3 .code')[3].value

    let rs = await http.get(`http://sltruman.xicp.net:49549/prove?_id=${this.phoneNumber}&password=${this.password}`)
    console.log(rs.body)

    if (rs.body) {
      console.log('登陆成功')
      await this.storage.set('user', { phoneNumber: this.phoneNumber, password: this.password })
    } else {
      console.log('登陆失败')
      $('.step-4').css('display', 'none')
      $('.step-3').css('display', 'flex')
      return;
    }

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
    let str = ['successed'];

    str.push('longitude:' + data.coords.longitude);
    str.push('latitude:' + data.coords.latitude);

    document.getElementById('tip').innerHTML = str.join('<br>')
    this.coords = data.coords

    if (this.coords.longitude != data.coords.longitude
      || this.coords.latitude != data.coords.latitude) {
      let rs = await http.getXhr(`http://sltruman.xicp.net:49549/self?${qs.stringify({ longitude: this.coords.longitude, latitude: this.coords.latitude })}`)
      console.log(rs.body)

      let wgs84togcj02 = ctf.wgs84togcj02(this.coords.longitude, this.coords.latitude);
      this.marker.setPosition(wgs84togcj02)
      this.marker.show()
    }

    let rs = await http.getXhr(`http://sltruman.xicp.net:49549/others?${qs.stringify({ list: this.phoneNumberList })}`)
    console.log(rs.body)
    let p = eval(rs.body)

    try {
      for (let k in p) {
        let wgs84togcj02 = ctf.wgs84togcj02(p[k].longitude, p[k].latitude);
        this.peoples[p[k]._id].setPosition(wgs84togcj02)
        this.peoples[p[k]._id].show()
      }
    } catch (e) {
      console.log(e)
    }
  }

  atSelf() {
    let wgs84togcj02 = ctf.wgs84togcj02(this.coords.longitude, this.coords.latitude);
    this.map.setCenter(wgs84togcj02)
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

    let watch = this.geolocation.watchPosition()
    this.locator = watch.subscribe(this.locate.bind(this))
  }
}
