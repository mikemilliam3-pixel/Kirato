
import { Language, TranslationDictionary } from '../types';

export const translations: Record<Language, TranslationDictionary> = {
  UZ: {
    appName: "Kirato AI",
    appSubtitle: "ASSISTANT",
    homeTitle: "Loyihani tanlang",
    homeSubtitle: "Sizga qanday yordam bera olamiz?",
    modules: {
      sales: { title: "Savdo va Do'kon", subtitle: "Savdoni oshirish" },
      smm: { title: "SMM va Kontent", subtitle: "Postlar yaratish" },
      education: { title: "Ta'lim", subtitle: "O'qing va o'rganing" },
      freelancer: { title: "Frilanser", subtitle: "Frilans asboblari" },
      travel: { title: "Sayohat Rejalovchi", subtitle: "Sayohatlarni rejalang" },
      health: { title: "Sog'liqni saqlash", subtitle: "Sog'lom maslahatlar" },
      legal: { title: "Yuridik Yordam", subtitle: "Qonun va shartnomalar" },
      resume: { title: "Rezyume va Ish", subtitle: "Karyerangizni quring" },
      voice: { title: "Ovoz Studiyasi", subtitle: "Audio yaratish" },
      automation: { title: "Biznes Avtomatlashtirish", subtitle: "Biznesni tashkil qilish" }
    },
    common: {
      back: "Orqaga",
      placeholder: "Hali tayyor emas..."
    }
  },
  RU: {
    appName: "Kirato AI",
    appSubtitle: "ASSISTANT",
    homeTitle: "Выберите проект",
    homeSubtitle: "Чем мы можем вам помочь?",
    modules: {
      sales: { title: "Продажи и Магазин", subtitle: "Рост продаж" },
      smm: { title: "SMM и Контент", subtitle: "Создание постов" },
      education: { title: "Образование", subtitle: "Учись и развивайся" },
      freelancer: { title: "Фрилансер", subtitle: "Инструменты фриланса" },
      travel: { title: "Планировщик Путешествий", subtitle: "Планируйте поездки" },
      health: { title: "Советы по Здоровью", subtitle: "Здоровые советы" },
      legal: { title: "Юридическая Помощь", subtitle: "Законы и договоры" },
      resume: { title: "Резюме и Работа", subtitle: "Стройте карьеру" },
      voice: { title: "Студия Голоса", subtitle: "Создание аудио" },
      automation: { title: "Автоматизация Бизнеса", subtitle: "Организация бизнеса" }
    },
    common: {
      back: "Назад",
      placeholder: "Еще не готово..."
    }
  },
  EN: {
    appName: "Kirato AI",
    appSubtitle: "ASSISTANT",
    homeTitle: "Select a project",
    homeSubtitle: "How can we help you?",
    modules: {
      sales: { title: "Sales & Shop", subtitle: "Boost sales" },
      smm: { title: "SMM & Content", subtitle: "Create posts" },
      education: { title: "Education", subtitle: "Learn & Grow" },
      freelancer: { title: "Freelancer", subtitle: "Freelance tools" },
      travel: { title: "Travel Planner", subtitle: "Plan your trips" },
      health: { title: "Health Advice", subtitle: "Healthy tips" },
      legal: { title: "Legal Assist", subtitle: "Law & contracts" },
      resume: { title: "Resume & Jobs", subtitle: "Build your career" },
      voice: { title: "Voice Studio", subtitle: "Create audio" },
      automation: { title: "Business Automation", subtitle: "Organize business" }
    },
    common: {
      back: "Back",
      placeholder: "Not ready yet..."
    }
  }
};
