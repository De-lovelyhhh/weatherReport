var QQMapWX = require('../libs/qqmap-wx-jssdk.js');
const app = getApp();
Page({
    data: {
      location,
      today:[
        { img: 'images/体感.png' },
        { img: 'images/运动.png' },
        { img: 'images/旅游.png' },
        { img: 'images/紫外线.png' },
        { img: 'images/洗车.png' },
        { 
          img: 'images/学习.png' ,
          name: '非常适宜'
        }
      ]
    },
  
  onLoad: function () {
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: '35EBZ-URMC5-6KRIU-QFYX4-YMDT6-FXFWI'
    });
    var that = this;
      wx.getLocation({
        success: res => {
          //调用接口
          this.qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: res => {
              console.log(res.result.address_component.city);
              this.setData({
                location: res.result.address_component.city
              })
              //查询当前城市天气
              this.getWeather(res.result.address_component.city);
            },
            fail: res => {
              console.log('fail');
            }
          });
          console.log(res.latitude, res.longitude)
        }
      });
    
  },
  onShow:function(){
    if(app.globalData.city!=''){
      this.setData({ location: app.globalData.city})
      this.getWeather(app.globalData.city);
    }
  },
  //根据城市名称查询天气
  getWeather: function (city) {
    var that = this;
    var url = 'http://v.juhe.cn/weather/index';
    wx.request({
      url: url,
      data: {
        cityname: city,
        key: "26f2138cc64be1ca703fc9648f5034dd"
      },
      success: function (res) {
        console.log(res);
        if(res.data.result!=null){
          var temperature = res.data.result.sk.temp;
          var weather = res.data.result.today.weather;
          var wet = res.data.result.sk.humidity;
          var wind = res.data.result.sk.wind_direction;
          var future = res.data.result.future;
          var todayt = res.data.result.today.temperature;
          var today;
          that.data.today[0].name = res.data.result.today.dressing_index;
          that.data.today[1].name = res.data.result.today.exercise_index;
          that.data.today[2].name = res.data.result.today.travel_index;
          that.data.today[3].name = res.data.result.today.uv_index;
          that.data.today[4].name = res.data.result.today.wash_index;
          today = that.data.today;
          console.log(that.data.today);
          that.setData({
            tempera: temperature,
            weather: weather,
            todayt: todayt,
            wet: wet,
            wind: wind,
            future: future,
            today: today
          });
        }else{
          wx.showModal({
            content: '天气查询失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('我知道了');
                wx.navigateTo({
                  url: 'changeCity/changeCity',
                })
              }
            }
          });
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          content: '天气查询失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('我知道了')
            }
          }
        });
      }
    })
  },

  //跳转到切换城市页面
  toCity:function(){
    wx.navigateTo({
      url: 'changeCity/changeCity',
    })
  }
});
