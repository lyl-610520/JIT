import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  zh: {
    translation: {
      appName: '恰逢其时',
      nav: { home: '主页', stats: '统计', wardrobe: '养成与商店', settings: '设置' },
      home: {
        punch: '打卡', awake: '我起床啦', sleep: '我要睡了', custom: '自定义打卡', add: '添加',
        life: '生活', study: '学习', work: '工作', music: '音乐', upload: '＋',
        countdown: '倒计时卡片', weatherLine: '当前天气：{{text}}',
        alarm: '闹钟', setAlarm: '设置一次性闹钟', confirm: '确定', cancel: '取消'
      },
      stats: { title: '统计', pieTitle: '历史打卡类别分布', lineTitle: '最近7日睡眠时长' },
      wardrobe: { title: '养成与商店', pet: '宠物', flower: '花朵' },
      settings: {
        title: '设置', display: '显示与语言', mode: '显示模式', system: '自动', light: '浅色', dark: '深色',
        lang: '语言', zh: '中文', en: 'English',
        personalization: '个性化', petName: '宠物名称', weatherPref: '天气偏好', dislike: '不喜欢的天气',
        countdown: '倒计时设置', titleLabel: '事件标题', dateLabel: '事件日期',
        smartNotify: '智能通知', dailyTime: '每日提醒时间', reqPerm: '申请通知权限',
        sfx: '轻声音效', sfxOn: '开启', sfxOff: '关闭',
        reset: '回到最初的时光', resetWarn: '这将清除所有数据。', thinkAgain: '我再想想', iKnow: '我明白',
        resetDone: '你即将涅槃重生，恭喜进入下一阶段'
      },
      greetings: {
        breakfast: '早上好，吃早饭了吗？', lunch: '上午好，今天午饭准备吃什么？',
        noon: '中午好，午休别忘了放松。', afternoon: '下午好，保持专注也别忘记补充能量。',
        evening: '晚上好，放松一下准备迎接夜晚。', night: '夜深了，注意休息哦。',
        rainyComfort: '今天下雨了，别担心，温柔对待自己。'
      },
      install: { tip: '添加到主屏幕，获得沉浸体验', add: '添加到主屏幕', close: '稍后' }
    }
  },
  en: {
    translation: {
      appName: 'just in time',
      nav: { home: 'Home', stats: 'Stats', wardrobe: 'Wardrobe', settings: 'Settings' },
      home: {
        punch: 'Check-in', awake: "I'm awake", sleep: "I'm going to sleep", custom: 'Custom', add: 'Add',
        life: 'Life', study: 'Study', work: 'Work', music: 'Music', upload: '+',
        countdown: 'Countdown', weatherLine: 'Current weather: {{text}}',
        alarm: 'Alarm', setAlarm: 'Set one-time alarm', confirm: 'Confirm', cancel: 'Cancel'
      },
      stats: { title: 'Statistics', pieTitle: 'Category distribution', lineTitle: 'Last 7 days sleep duration' },
      wardrobe: { title: 'Wardrobe & Shop', pet: 'Pet', flower: 'Flower' },
      settings: {
        title: 'Settings', display: 'Display & Language', mode: 'Mode', system: 'Auto', light: 'Light', dark: 'Dark',
        lang: 'Language', zh: '中文', en: 'English',
        personalization: 'Personalization', petName: 'Pet name', weatherPref: 'Weather preference', dislike: 'Disliked weather',
        countdown: 'Countdown', titleLabel: 'Event title', dateLabel: 'Event date',
        smartNotify: 'Smart notifications', dailyTime: 'Daily reminder time', reqPerm: 'Request notification permission',
        sfx: 'Sound FX', sfxOn: 'On', sfxOff: 'Off',
        reset: 'Back to the beginning', resetWarn: 'This will clear all data.', thinkAgain: 'Cancel', iKnow: 'Proceed',
        resetDone: 'Reborn — welcome to the next stage'
      },
      greetings: {
        breakfast: 'Good morning — have you had breakfast?', lunch: 'Good morning — what for lunch today?',
        noon: 'Good noon — take a mindful break.', afternoon: 'Good afternoon — stay focused and gentle.',
        evening: 'Good evening — unwind a little.', night: 'It is late — rest well.',
        rainyComfort: 'It rains today. Be kind to yourself.'
      },
      install: { tip: 'Add to Home Screen for an immersive experience', add: 'Add to Home Screen', close: 'Later' }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.startsWith('zh') ? 'zh' : 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

export default i18n