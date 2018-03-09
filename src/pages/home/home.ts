import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
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
  ) {
    events.subscribe('appExit', () => {
      $('.step-exit').css('display', 'flex')
    })
  }

  ionViewDidLoad() {
    this.map = new AMap.Map('container', {
      resizeEnable: true
    })

    //按钮事件
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
      }
    }, 1000)
  }

  signIn() {
    let timer
    $('.step-4').show('fast', () => {
      timer = setInterval(() => {
        if ($('.step-4 .hint')[0].innerHTML.length > 10)
          $('.step-4 .hint')[0].innerHTML = 'signing'
        else
          $('.step-4 .hint')[0].innerHTML += '.'
      }, 1000)
    })

    if (true) {
      $('.step-4').hide('fast', () => {
        $('.step-4 .hint').value = 'signing'
        clearInterval(timer)
      })
    }
  }
}
