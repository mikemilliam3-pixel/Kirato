export const salesTranslations = {
  UZ: {
    title: "Savdo va Do'kon",
    sections: {
      dashboard: "Boshqaruv",
      products: "Mahsulotlar",
      channelPosting: "Kanal",
      publicShop: "Do'kon",
      orders: "Buyurtmalar",
      customers: "Mijozlar",
      chat: "Chat",
      promotions: "Aksiyalar",
      settings: "Sozlamalar",
      supportInbox: "Yordam markazi"
    },
    dashboard: {
      totalSales: "Jami savdo",
      onHoldFunds: "Muzlatilgan mablag'lar",
      orders: "Buyurtmalar",
      disputedOrders: "Bahsli buyurtmalar",
      quickActions: "Tezkor amallar",
      addProduct: "Mahsulot qo'shish",
      viewShop: "Do'konni ko'rish",
      shareChannel: "Kanalga ulashish",
      recentOrders: "Oxirgi buyurtmalar"
    },
    orders: {
      status: {
        pending: "Kutilmoqda",
        processing: "Jarayonda",
        shipped: "Yuborildi",
        delivered: "Yetkazildi",
        cancelled: "Bekor qilindi",
        disputed: "Bahsli",
        refunded: "Qaytarildi"
      }
    },
    cart: {
      add_to_cart: "Savatga qo‘shish",
      contact_seller: "Sotuvchi bilan aloqa",
      added_to_cart: "Savatga qo‘shildi",
      cart_title: "Savatingiz",
      checkout: "Buyurtma berish",
      remove: "O‘chirish",
      clear_cart: "Savatni tozalash",
      empty_cart: "Savat bo‘sh",
      start_shopping: "Xaridni boshlash",
      estimated_total: "Jami summa"
    },
    checkout: {
      checkout_title: "Buyurtma",
      payment_method: "To‘lov usuli",
      place_order: "Buyurtma berish",
      order_success: "Buyurtma muvaffaqiyatli yuborildi",
      escrow_note: "To'lov yetkazib berish tasdiqlangunga qadar platformada saqlanadi.",
      payment_methods: {
        card: "Karta",
        cash_on_delivery: "Yetkazib berishda to‘lov",
        bank_transfer: "Bank o‘tkazmasi"
      },
      fields: {
        full_name: "To‘liq ism",
        phone: "Telefon",
        address: "Manzil",
        city: "Shahar",
        card_number: "Karta raqami",
        expiry: "Amal qilish muddati",
        cvc: "CVC",
        transaction_id: "Tranzaksiya kodi",
        receipt_link: "Chek nusxasi (link)"
      },
      success: {
        title: "Buyurtma qabul qilindi!",
        subtitle: "Sizning buyurtmangiz muvaffaqiyatli ro'yxatga olindi.",
        security_code_title: "Yetkazib berish xavfsizlik kodi",
        security_warning: "USHBU KODNI TOVARNI QO'LINGIZGA OLGUNCHA HECH KIMGA BERMANG.",
        copy_code: "Kodni nusxalash"
      }
    },
    channel: {
      title: "Kanalga ulash",
      subtitle: "Mahsulotlarni ijtimoiy tarmoqlarga avtomatik yuborish",
      status: {
        connected: "Ulangan",
        notConnected: "Ulanmagan"
      },
      telegram: {
        title: "Telegram",
        desc: "O'z botingiz orqali kanalingizga postlar yuboring",
        botToken: "Bot Token",
        channelUsername: "Kanal ID yoki Username"
      },
      instagram: {
        title: "Instagram",
        desc: "Mahsulotlarni Instagram biznes profilingizga joylang",
        username: "Username",
        accessToken: "Access Token",
        businessId: "Instagram Business ID",
        tokenHint: "Meta for Developers portalidan olingan token",
        idHint: "Instagram Business Account ID",
        oauthNote: "Hozirda faqat professional akkauntlar qo'llab-quvvatlanadi"
      },
      actions: {
        manage: "Boshqarish",
        connect: "Ulash",
        save: "Saqlash",
        disconnect: "Ulanishni uzish"
      },
      validation: {
        invalidToken: "Noto'g'ri bot tokeni",
        invalidChannel: "Kanal nomi @ bilan boshlanishi kerak",
        usernameRequired: "Username kiritish majburiy"
      }
    },
    chat: {
      title: "Muloqotlar",
      aiMode: "AI yordamchi",
      sellerMode: "Sotuvchi rejimi",
      returnToAi: "AI ga topshirish",
      suggestReply: "AI taklifi",
      type: "Xabar yozing...",
      online: "Onlayn",
      noConversations: "Hozircha suhbatlar yo'q"
    },
    promotions: {
      active: "Faol",
      expired: "Muddati o'tgan"
    },
    customers: {
      title: "Mijozlar",
      search: "Mijozni qidirish...",
      viewHistory: "Tarixni ko'rish"
    },
    settings: {
      success: "Sozlamalar saqlandi",
      closed: "Yopiq",
      cancel: "Bekor qilish",
      shopProfile: "Do'kon profili",
      shopName: "Do'kon nomi",
      description: "Tavsif",
      city: "Shahar",
      workingHours: "Ish vaqti",
      selectDays: "Kunlarni tanlang",
      startTime: "Boshlanish",
      endTime: "Tugash",
      contact: "Aloqa ma'lumotlari",
      saveChanges: "Saqlash",
      presets: {
        monFri: "Dush-Jum",
        monSat: "Dush-Shan",
        everyday: "Har kuni"
      },
      days: {
        mon: "Du", tue: "Se", wed: "Ch", thu: "Pa", fri: "Ju", sat: "Sh", sun: "Ya"
      },
      verification: {
        title: "Tasdiqlash",
        unverified: "Tasdiqlanmagan",
        pending: "Kutilmoqda",
        verified: "Tasdiqlangan",
        rejected: "Rad etilgan",
        requestBtn: "So'rov yuborish",
        resubmitBtn: "Qayta yuborish",
        pendingMessage: "Sizning arizangiz ko'rib chiqilmoqda. Iltimos, kuting.",
        adminNote: "Admin izohi",
        sellerType: "Sotuvchi turi",
        individual: "Jismoniy shaxs",
        business: "Yuridik shaxs",
        uploadIdFront: "Passport/ID (old tomoni)",
        uploadIdBack: "Passport/ID (orqa tomoni)",
        uploadBusinessCert: "Guvohnoma (nusxa)",
        missingDocs: "Hujjatlar to'liq emas",
        requestSent: "So'rov muvaffaqiyatli yuborildi",
        submitBtn: "Arizani yuborish",
        fileRequirements: "PNG, JPG yoki PDF (Max 10MB)"
      }
    },
    supportInbox: {
      title: "Yordam markazi",
      notAuthorized: "Ruxsat berilmagan",
      detail: {
        back: "Orqaga",
        actions: "Amallar"
      }
    },
    publicShop: {
      shopProfile: "Do'kon haqida",
      success: {
        linkCopied: "Havola nusxalandi"
      }
    },
    products: {
      inventory: "Ombor",
      add: "Qo'shish",
      edit: "Tahrirlash",
      search: "Qidirish...",
      all: "Barchasi",
      active: "Faol",
      pending: "Kutilmoqda",
      draft: "Qoralama",
      archived: "Arxivlangan",
      outOfStock: "Tugagan",
      published: "E'lon qilingan",
      public: "Ochiq",
      private: "Yopiq",
      unlisted: "Ro'yxatdan tashqari",
      productLink: "Mahsulot havolasi",
      categories: {
        clothing: "Kiyim",
        shoes: "Poyabzal",
        bags: "Sumkalar",
        electronics: "Elektronika",
        home: "Uy-ro'zg'or",
        beauty: "Go'zallik",
        kids: "Bolalar uchun",
        sports: "Sport",
        auto: "Avto",
        books: "Kitoblar",
        food: "Oziq-ovqat",
        other: "Boshqa"
      }
    },
    newProduct: {
      title: "Yangi mahsulot",
      basicInfo: "Asosiy ma'lumotlar",
      nameLabel: "Mahsulot nomi",
      namePlaceholder: "Masalan: iPhone 15 Pro",
      catLabel: "Toifa",
      shortDescLabel: "Qisqa tavsif",
      shortDescPlaceholder: "Mahsulot haqida bir necha so'z",
      fullDescLabel: "To'liq tavsif",
      fullDescPlaceholder: "Batafsil ma'lumot (Markdown qo'llab-quvvatlanadi)",
      tagsLabel: "Teglar",
      tagsPlaceholder: "Teg yozing...",
      tagsAdd: "Qo'shish",
      media: "Media",
      coverLabel: "Asosiy rasm",
      videoLabel: "Video sharh",
      upload: "Yuklash",
      pricing: "Narxlash",
      priceLabel: "Narx",
      discountLabel: "Chegirma (%)",
      currencyLabel: "Valyuta",
      statusMod: "Holat va Ko'rinish",
      statusLabel: "Holat",
      visibilitySettings: "Ko'rinish",
      cancel: "Bekor qilish",
      create: "Yaratish",
      remove: "O'chirish",
      errors: {
        name: "Nom kiritilishi shart",
        category: "Toifa tanlang",
        price: "Narx noto'g'ri"
      }
    }
  },
  RU: {
    title: "Продажи и Магазин",
    sections: {
      dashboard: "Дашборд",
      products: "Товары",
      channelPosting: "Канал",
      publicShop: "Магазин",
      orders: "Заказы",
      customers: "Клиенты",
      chat: "Чат",
      promotions: "Акции",
      settings: "Настройки",
      supportInbox: "Поддержка"
    },
    dashboard: {
      totalSales: "Общие продажи",
      onHoldFunds: "Удержанные средства",
      orders: "Заказы",
      disputedOrders: "Споры",
      quickActions: "Быстрые действия",
      addProduct: "Добавить товар",
      viewShop: "Смотреть магазин",
      shareChannel: "В канал",
      recentOrders: "Последние заказы"
    },
    orders: {
      status: {
        pending: "Ожидает",
        processing: "В обработке",
        shipped: "Отправлен",
        delivered: "Доставлен",
        cancelled: "Отменен",
        disputed: "В споре",
        refunded: "Возврат"
      }
    },
    cart: {
      add_to_cart: "В корзину",
      contact_seller: "Связаться с продавцом",
      added_to_cart: "Добавлено в корзину",
      cart_title: "Ваша корзина",
      checkout: "Оформить заказ",
      remove: "Удалить",
      clear_cart: "Очистить корзину",
      empty_cart: "Корзина пуста",
      start_shopping: "Начать покупки",
      estimated_total: "Итоговая сумма"
    },
    checkout: {
      checkout_title: "Оформление заказа",
      payment_method: "Способ оплаты",
      place_order: "Оформить заказ",
      order_success: "Заказ успешно оформлен",
      escrow_note: "Платеж удерживается платформой до подтверждения доставки.",
      payment_methods: {
        card: "Карта",
        cash_on_delivery: "Оплата при получении",
        bank_transfer: "Банковский перевод"
      },
      fields: {
        full_name: "Полное имя",
        phone: "Телефон",
        address: "Адрес",
        city: "Город",
        card_number: "Номер карты",
        expiry: "Срок действия",
        cvc: "CVC",
        transaction_id: "Код транзакции",
        receipt_link: "Ссылка на чек"
      },
      success: {
        title: "Заказ оформлен!",
        subtitle: "Ваш заказ успешно зарегистрирован.",
        security_code_title: "Код безопасности доставки",
        security_warning: "НЕ ПЕРЕДАВАЙТЕ ЭТОТ КОД, ПОKА НЕ ПОЛУЧИТЕ ТОВАР В РУКИ.",
        copy_code: "Копировать код"
      }
    },
    channel: {
      title: "Публикация в каналы",
      subtitle: "Автоматический постинг товаров в соцсети",
      status: {
        connected: "Подключено",
        notConnected: "Не подключено"
      },
      telegram: {
        title: "Telegram",
        desc: "Публикуйте товары в свой канал через бота",
        botToken: "Токен бота",
        channelUsername: "ID или Username канала"
      },
      instagram: {
        title: "Instagram",
        desc: "Размещайте товары в профиль Instagram Business",
        username: "Имя пользователя",
        accessToken: "Access Token",
        businessId: "Instagram Business ID",
        tokenHint: "Токен из портала Meta for Developers",
        idHint: "ID аккаунта Instagram Business",
        oauthNote: "Поддерживаются только профессиональные аккаунты"
      },
      actions: {
        manage: "Управление",
        connect: "Подключить",
        save: "Сохранить",
        disconnect: "Отключить"
      },
      validation: {
        invalidToken: "Неверный токен бота",
        invalidChannel: "Имя канала должно начинаться с @",
        usernameRequired: "Имя пользователя обязательно"
      }
    },
    chat: {
      title: "Чаты",
      aiMode: "AI Помощник",
      sellerMode: "Режим продавца",
      returnToAi: "Передать AI",
      suggestReply: "AI ответ",
      type: "Введите сообщение...",
      online: "В сети",
      noConversations: "Пока нет диалогов"
    },
    promotions: {
      active: "Активна",
      expired: "Истекла"
    },
    customers: {
      title: "Клиенты",
      search: "Поиск клиента...",
      viewHistory: "История"
    },
    settings: {
      success: "Настройки сохранены",
      closed: "Закрыто",
      cancel: "Отмена",
      shopProfile: "Профиль магазина",
      shopName: "Название магазина",
      description: "Описание",
      city: "Город",
      workingHours: "Режим работы",
      selectDays: "Выберите дни",
      startTime: "Начало",
      endTime: "Конец",
      contact: "Контакты",
      saveChanges: "Сохранить",
      presets: {
        monFri: "Пн-Пт",
        monSat: "Пн-Сб",
        everyday: "Ежедневно"
      },
      days: {
        mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс"
      },
      verification: {
        title: "Верификация",
        unverified: "Не подтвержден",
        pending: "На проверке",
        verified: "Подтвержден",
        rejected: "Отклонен",
        requestBtn: "Подать заявку",
        resubmitBtn: "Повторить",
        pendingMessage: "Ваша заявка на рассмотрении. Пожалуйста, подождите.",
        adminNote: "Заметка админа",
        sellerType: "Тип продавца",
        individual: "Физ. лицо",
        business: "Юр. лицо",
        uploadIdFront: "Паспорт/ID (лицо)",
        uploadIdBack: "Паспорт/ID (оборот)",
        uploadBusinessCert: "Свидетельство (копия)",
        missingDocs: "Не все документы загружены",
        requestSent: "Заявка успешно отправлена",
        submitBtn: "Отправить заявку",
        fileRequirements: "PNG, JPG или PDF (Макс 10МБ)"
      }
    },
    supportInbox: {
      title: "Поддержка",
      notAuthorized: "Доступ запрещен",
      detail: {
        back: "Назад",
        actions: "Действия"
      }
    },
    publicShop: {
      shopProfile: "О магазине",
      success: {
        linkCopied: "Ссылка скопирована"
      }
    },
    products: {
      inventory: "Инвентарь",
      add: "Добавить",
      edit: "Изменить",
      search: "Поиск...",
      all: "Все",
      active: "Активен",
      pending: "Ожидает",
      draft: "Черновик",
      archived: "Архив",
      outOfStock: "Нет в наличии",
      published: "Опубликован",
      public: "Публичный",
      private: "Приватный",
      unlisted: "Скрытый",
      productLink: "Ссылка на товар",
      categories: {
        clothing: "Одежда",
        shoes: "Обувь",
        bags: "Сумки",
        electronics: "Электроника",
        home: "Дом",
        beauty: "Красота",
        kids: "Детям",
        sports: "Спорт",
        auto: "Авто",
        books: "Книги",
        food: "Еда",
        other: "Другое"
      }
    },
    newProduct: {
      title: "Новый товар",
      basicInfo: "Основная информация",
      nameLabel: "Название товара",
      namePlaceholder: "Напр.: iPhone 15 Pro",
      catLabel: "Категория",
      shortDescLabel: "Краткое описание",
      shortDescPlaceholder: "Пару слов о товаре",
      fullDescLabel: "Полное описание",
      fullDescPlaceholder: "Детали (поддержка Markdown)",
      tagsLabel: "Теги",
      tagsPlaceholder: "Введите тег...",
      tagsAdd: "Добавить",
      media: "Медиа",
      coverLabel: "Обложка",
      videoLabel: "Видео-обзор",
      upload: "Загрузить",
      pricing: "Цена",
      priceLabel: "Цена",
      discountLabel: "Скидка (%)",
      currencyLabel: "Валюта",
      statusMod: "Статус и видимость",
      statusLabel: "Статус",
      visibilitySettings: "Видимость",
      cancel: "Отмена",
      create: "Создать",
      remove: "Удалить",
      errors: {
        name: "Введите название",
        category: "Выберите категорию",
        price: "Неверная цена"
      }
    }
  },
  EN: {
    title: "Sales & Shop",
    sections: {
      dashboard: "Dashboard",
      products: "Products",
      channelPosting: "Channel",
      publicShop: "Shop",
      orders: "Orders",
      customers: "Customers",
      chat: "Chat",
      promotions: "Promotions",
      settings: "Settings",
      supportInbox: "Support Inbox"
    },
    dashboard: {
      totalSales: "Total Sales",
      onHoldFunds: "On-Hold Funds",
      orders: "Orders",
      disputedOrders: "Disputed",
      quickActions: "Quick Actions",
      addProduct: "Add Product",
      viewShop: "View Shop",
      shareChannel: "Share Channel",
      recentOrders: "Recent Orders"
    },
    orders: {
      status: {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
        disputed: "Disputed",
        refunded: "Refunded"
      }
    },
    cart: {
      add_to_cart: "Add to Cart",
      contact_seller: "Contact Seller",
      added_to_cart: "Added to cart",
      cart_title: "Your Cart",
      checkout: "Checkout",
      remove: "Remove",
      clear_cart: "Clear Cart",
      empty_cart: "Cart is empty",
      start_shopping: "Start Shopping",
      estimated_total: "Estimated Total"
    },
    checkout: {
      checkout_title: "Checkout",
      payment_method: "Payment Method",
      place_order: "Place Order",
      order_success: "Order placed successfully",
      escrow_note: "Payments are held in Escrow until you confirm delivery.",
      payment_methods: {
        card: "Card",
        cash_on_delivery: "Cash on Delivery",
        bank_transfer: "Bank Transfer"
      },
      fields: {
        full_name: "Full Name",
        phone: "Phone",
        address: "Address",
        city: "City",
        card_number: "Card Number",
        expiry: "Expiry",
        cvc: "CVC",
        transaction_id: "Transaction ID",
        receipt_link: "Receipt Link"
      },
      success: {
        title: "Order Placed!",
        subtitle: "Your order has been received.",
        security_code_title: "Delivery Security Code",
        security_warning: "DO NOT SHARE THIS CODE UNTIL YOU HAVE THE ITEM IN YOUR HANDS.",
        copy_code: "Copy Code"
      }
    },
    channel: {
      title: "Channel Posting",
      subtitle: "Automatically post products to your social channels",
      status: {
        connected: "Connected",
        notConnected: "Not Connected"
      },
      telegram: {
        title: "Telegram",
        desc: "Post products to your channel using your own bot",
        botToken: "Bot Token",
        channelUsername: "Channel ID or Username"
      },
      instagram: {
        title: "Instagram",
        desc: "Share products directly to your Instagram Business profile",
        username: "Username",
        accessToken: "Access Token",
        businessId: "Instagram Business ID",
        tokenHint: "Get from Meta for Developers",
        idHint: "Instagram Business Account ID",
        oauthNote: "Only Professional accounts are supported"
      },
      actions: {
        manage: "Manage",
        connect: "Connect",
        save: "Save",
        disconnect: "Disconnect"
      },
      validation: {
        invalidToken: "Invalid bot token",
        invalidChannel: "Channel must start with @",
        usernameRequired: "Username is required"
      }
    },
    chat: {
      title: "Messages",
      aiMode: "AI Assistant",
      sellerMode: "Seller Mode",
      returnToAi: "Handover to AI",
      suggestReply: "AI Suggestion",
      type: "Type a message...",
      online: "Online",
      noConversations: "No conversations yet"
    },
    promotions: {
      active: "Active",
      expired: "Expired"
    },
    customers: {
      title: "Customers",
      search: "Search customers...",
      viewHistory: "View History"
    },
    settings: {
      success: "Settings saved successfully",
      closed: "Closed",
      cancel: "Cancel",
      shopProfile: "Shop Profile",
      shopName: "Shop Name",
      description: "Description",
      city: "City",
      workingHours: "Working Hours",
      selectDays: "Select Days",
      startTime: "Start Time",
      endTime: "End Time",
      contact: "Contact Information",
      saveChanges: "Save Changes",
      presets: {
        monFri: "Mon-Fri",
        monSat: "Mon-Sat",
        everyday: "Everyday"
      },
      days: {
        mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun"
      },
      verification: {
        title: "Verification",
        unverified: "Unverified",
        pending: "Pending",
        verified: "Verified",
        rejected: "Rejected",
        requestBtn: "Request Verification",
        resubmitBtn: "Resubmit Request",
        pendingMessage: "Your application is under review. Please wait.",
        adminNote: "Admin Note",
        sellerType: "Seller Type",
        individual: "Individual",
        business: "Business",
        uploadIdFront: "ID/Passport (Front)",
        uploadIdBack: "ID/Passport (Back)",
        uploadBusinessCert: "Business Certificate",
        missingDocs: "Missing required documents",
        requestSent: "Verification request sent",
        submitBtn: "Submit Application",
        fileRequirements: "PNG, JPG or PDF (Max 10MB)"
      }
    },
    supportInbox: {
      title: "Support Inbox",
      notAuthorized: "Not authorized",
      detail: {
        back: "Back",
        actions: "Actions"
      }
    },
    publicShop: {
      shopProfile: "Shop Profile",
      success: {
        linkCopied: "Link copied"
      }
    },
    products: {
      inventory: "Inventory",
      add: "Add",
      edit: "Edit",
      search: "Search...",
      all: "All",
      active: "Active",
      pending: "Pending",
      draft: "Draft",
      archived: "Archived",
      outOfStock: "Out of Stock",
      published: "Published",
      public: "Public",
      private: "Private",
      unlisted: "Unlisted",
      productLink: "Product Link",
      categories: {
        clothing: "Clothing",
        shoes: "Shoes",
        bags: "Bags",
        electronics: "Electronics",
        home: "Home",
        beauty: "Beauty",
        kids: "Kids",
        sports: "Sports",
        auto: "Auto",
        books: "Books",
        food: "Food",
        other: "Other"
      }
    },
    newProduct: {
      title: "New Product",
      basicInfo: "Basic Info",
      nameLabel: "Product Name",
      namePlaceholder: "e.g. iPhone 15 Pro",
      catLabel: "Category",
      shortDescLabel: "Short Description",
      shortDescPlaceholder: "Few words about the product",
      fullDescLabel: "Full Description",
      fullDescPlaceholder: "Details (Markdown supported)",
      tagsLabel: "Tags",
      tagsPlaceholder: "Type a tag...",
      tagsAdd: "Add",
      media: "Media",
      coverLabel: "Cover Image",
      videoLabel: "Video Review",
      upload: "Upload",
      pricing: "Pricing",
      priceLabel: "Price",
      discountLabel: "Discount (%)",
      currencyLabel: "Valyuta",
      statusMod: "Status & Visibility",
      statusLabel: "Status",
      visibilitySettings: "Visibility",
      cancel: "Cancel",
      create: "Create",
      remove: "Remove",
      errors: {
        name: "Name is required",
        category: "Select a category",
        price: "Invalid price"
      }
    }
  }
};