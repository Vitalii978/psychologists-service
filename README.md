# Psychologists.Services

Web application for finding psychologists and booking consultations.

## 🚀 Live Demo
[Link will be added after deployment](#)

## 📋 Project Description

Psychologists.Services is a platform that connects people with professional psychologists. Users can browse psychologists, filter them by various criteria, save favorites, and book appointments.

## ✨ Features

### 🔐 Authentication
- User registration and login
- Secure authentication via Firebase
- Protected routes (Favorites page only for authorized users)

### 🔍 Psychologist Search
- Browse all available psychologists
- Filter by: name (A-Z, Z-A), price (low-high, high-low), rating
- Pagination with "Load more" button (3 items per load)
- Detailed view with reviews and information

### ❤️ Favorites System
- Add/remove psychologists to favorites
- Favorites stored in Firebase Realtime Database
- Dedicated favorites page
- Heart icon changes color for favorites

### 📅 Appointment Booking
- Book consultations with psychologists
- Form validation with react-hook-form & yup
- Appointment data saved to Firebase
- Time selection via dropdown

### 🎨 User Interface
- Responsive design (from 320px to 1440px)
- Modern and clean interface
- Interactive modals with animations
- Back-to-top button with smooth scrolling

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **React Router 6** - navigation and routing
- **React Hook Form** - form handling
- **Yup** - form validation
- **Firebase 10** - authentication and database
- **CSS Modules** - component styling

### Backend & Database
- **Firebase Authentication** - user management
- **Firebase Realtime Database** - psychologist data, favorites, appointments

### Development Tools
- **Vite** - build tool and development server
- **ESLint** - code quality checking
- **Git** - version control

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Mobile**: 320px - 480px
- **Tablet**: 768px - 1024px
- **Desktop**: 1280px - 1440px

## 🔐 Authentication Process

1. **Registration**: Users can register with name, email, and password
2. **Login**: Registered users can log in with email and password
3. **Session Persistence**: Users remain authorized between browser sessions
4. **Protected Routes**: Favorites page is only accessible to authorized users
5. **Authorization**: Some actions (adding to favorites, booking) require authorization

## 🎯 Key Implemented Features

### Pagination
- Loads 3 psychologists at a time
- "Load more" button fetches next batch
- Implemented using Firebase `limitToFirst()` and `startAfter()`

### Favorites System
- Heart icon toggles favorite status
- Favorites stored in Firebase per user
- Real-time updates without page reload
- Notification for unauthorized users

### Appointment Booking
- Modal form with validation
- Time selection dropdown
- Data saved to Firebase

### Filtering and Sorting
- Sort by: name (A-Z, Z-A), price (low-high, high-low), rating
- Client-side sorting for loaded data
- Real-time filter updates

## 📄 Completed Technical Requirements

- ✅ User authentication with Firebase
- ✅ Form validation with react-hook-form & yup
- ✅ Psychologist filtering and sorting
- ✅ Favorites functionality with Firebase
- ✅ Appointment booking system
- ✅ Responsive design (from 320px to 1440px)
- ✅ Pagination with "Load more" button
- ✅ Modal windows with proper close handlers
- ✅ Error handling and user feedback
- ✅ Code quality and formatting

## 🚀 Application Routes

### Available Routes:
- **`/`** - Home page with service description
- **`/psychologists`** - Psychologists list page (filtering, pagination)
- **`/favorites`** - Favorites page (only for authorized users)

### Protected Routes:
- `/favorites` page - automatically redirects to home if user is not authorized

### Modal Windows (not routes):
- **Login Modal** - account login form
- **Register Modal** - new user registration form
- **Appointment Modal** - consultation booking form
- **Auth Required Modal** - authorization required message

## ⚙️ Installation and Setup

### 1. Clone Repository
git clone https://github.com/Vitalii978/psychologists-service


### 2. Go to Project Directory
cd psychologists.services


### 3. Install Dependencies
npm install


### 4. Start Development Server
npm start


## 🔗 Links

- **Figma Design**: [View Design Mockups](https://www.figma.com/design/I5vjNb0NsJOpQRnRpMloSY/Psychologists.Services?node-id=0-1&t=jrJ7yBrTDgJi6N6j-1)
- **Technical Requirements**: [View Technical Requirements](https://docs.google.com/document/d/1PrTxBn6HQbb0Oz17g5_zvyLGIOZg0TIP3HPaEEp6ZLs/edit?tab=t.0)

## 👤 Author

**Vitalii Klymenko**

- GitHub: [https://github.com/VitaliiKlymenko](https://github.com/VitaliiKlymenko)
- LinkedIn: [https://linkedin.com/in/vitalii-klymenko](https://linkedin.com/in/vitalii-klymenko)

## 📄 License

This project was created for educational purposes as part of a technical assignment.


## UA


# Psychologists.Services


Веб-приложение для поиска психологов и записи на консультации.

## 🚀 Живая демонстрация
[Ссылка появится после деплоя](#)

## 📋 Описание проекта

Psychologists.Services - это платформа, которая соединяет людей с профессиональными психологами. Пользователи могут просматривать психологов, фильтровать их по различным критериям, сохранять в избранное и записываться на прием.

## ✨ Возможности

### 🔐 Аутентификация
- Регистрация и вход пользователей
- Безопасная аутентификация через Firebase
- Защищенные маршруты (страница "Избранное" только для авторизованных)

### 🔍 Поиск психологов
- Просмотр всех доступных психологов
- Фильтрация по: имени (А-Я, Я-А), цене (дешевле-дороже, дороже-дешевле), рейтингу
- Пагинация с кнопкой "Загрузить еще" (по 3 карточки за раз)
- Детальный просмотр с отзывами и информацией

### ❤️ Система избранного
- Добавление/удаление психологов в избранное
- Избранное сохраняется в Firebase Realtime Database
- Отдельная страница избранного
- Иконка сердца меняет цвет для избранных

### 📅 Запись на прием
- Запись на консультацию к психологу
- Валидация форм с react-hook-form & yup
- Данные о записи сохраняются в Firebase
- Выбор времени через выпадающий список

### 🎨 Пользовательский интерфейс
- Адаптивный дизайн (от 320px до 1440px)
- Современный и чистый интерфейс
- Интерактивные модальные окна с анимациями
- Кнопка "Наверх" с плавной прокруткой

## 🛠️ Используемые технологии

### Frontend
- **React 18** - библиотека для UI
- **React Router 6** - навигация и маршрутизация
- **React Hook Form** - работа с формами
- **Yup** - валидация форм
- **Firebase 10** - аутентификация и база данных
- **CSS Modules** - стилизация компонентов

### Backend & База данных
- **Firebase Authentication** - управление пользователями
- **Firebase Realtime Database** - данные психологов, избранное, записи

### Инструменты разработки
- **Vite** - сборка и сервер разработки
- **ESLint** - проверка качества кода
- **Git** - контроль версий

## 📱 Адаптивный дизайн

Приложение полностью адаптивно и оптимизировано для:

- **Мобильные**: 320px - 480px
- **Планшеты**: 768px - 1024px
- **Десктоп**: 1280px - 1440px

## 🔐 Процесс аутентификации

1. **Регистрация**: Пользователи могут зарегистрироваться с именем, email и паролем
2. **Вход**: Зарегистрированные пользователи могут войти с email и паролем
3. **Сохранение сессии**: Пользователи остаются авторизованными между сессиями браузера
4. **Защищенные маршруты**: Страница избранного доступна только авторизованным пользователям
5. **Авторизация**: Некоторые действия (добавление в избранное, запись) требуют авторизации

## 🎯 Ключевые реализованные функции

### Пагинация
- Загружает по 3 психолога за раз
- Кнопка "Загрузить еще" получает следующую порцию
- Реализовано с помощью Firebase `limitToFirst()` и `startAfter()`

### Система избранного
- Иконка сердца переключает статус избранного
- Избранное сохраняется в Firebase для каждого пользователя
- Обновления в реальном времени без перезагрузки страницы
- Уведомление для неавторизованных пользователей

### Запись на прием
- Модальная форма с валидацией
- Выпадающий список выбора времени
- Данные сохраняются в Firebase

### Фильтрация и сортировка
- Сортировка по: имени (А-Я, Я-А), цене (дешевле-дороже, дороже-дешевле), рейтингу
- Сортировка на стороне клиента для загруженных данных
- Обновление фильтров в реальном времени

## 📄 Выполненные технические требования

- ✅ Аутентификация пользователей с Firebase
- ✅ Валидация форм с react-hook-form & yup
- ✅ Фильтрация и сортировка психологов
- ✅ Функциональность избранного с Firebase
- ✅ Система записи на прием
- ✅ Адаптивный дизайн (от 320px до 1440px)
- ✅ Пагинация с кнопкой "Загрузить еще"
- ✅ Модальные окна с правильными обработчиками закрытия
- ✅ Обработка ошибок и обратная связь пользователю
- ✅ Качество кода и форматирование

## 🚀 Маршруты приложения

### Доступные маршруты:
- **`/`** - Главная страница с описанием сервиса
- **`/psychologists`** - Страница со списком психологов (фильтрация, пагинация)
- **`/favorites`** - Страница избранных психологов (доступна только для авторизованных)

### Защищенные маршруты:
- Страница `/favorites` - автоматически перенаправляет на главную, если пользователь не авторизован

### Модальные окна (не маршруты):
- **Login Modal** - форма входа в аккаунт
- **Register Modal** - форма регистрации нового пользователя
- **Appointment Modal** - форма записи на консультацию
- **Auth Required Modal** - сообщение о необходимости авторизации

## ⚙️ Установка и запуск

### 1. Клонирование репозитория
git clone https://github.com/Vitalii978/psychologists-service

### 2. Переход в папку проекта
cd psychologists.services

### 3. Установка зависимостей
npm install

### 4. Запуск приложения
npm start


## 🔗 Ссылки

- **Дизайн в Figma**: [Посмотреть дизайн](https://www.figma.com/design/I5vjNb0NsJOpQRnRpMloSY/Psychologists.Services?node-id=0-1&t=jrJ7yBrTDgJi6N6j-1)
- **Техническое задание**: [Посмотреть техзадание](https://docs.google.com/document/d/1PrTxBn6HQbb0Oz17g5_zvyLGIOZg0TIP3HPaEEp6ZLs/edit?tab=t.0)

## 👤 Автор

**Vitalii Klymenko**

- GitHub: [https://github.com/VitaliiKlymenko](https://github.com/VitaliiKlymenko)
- LinkedIn: [https://linkedin.com/in/vitalii-klymenko](https://linkedin.com/in/vitalii-klymenko)

## 📄 Лицензия

Этот проект создан в образовательных целях как часть технического задания.