# Expo Map App

Приложение на React Native с картой, маркерами и локальной базой данных SQLite.

## Установка

```bash
npm install
npx expo start
```

## Схема базы данных

### Таблица `markers`

| Поле | Тип | Описание |
|---|---|---|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Уникальный идентификатор |
| `latitude` | REAL NOT NULL | Широта |
| `longitude` | REAL NOT NULL | Долгота |
| `created_at` | DATETIME | Дата создания |

### Таблица `marker_images`

| Поле | Тип | Описание |
|---|---|---|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Уникальный идентификатор |
| `marker_id` | INTEGER NOT NULL | Внешний ключ на `markers.id` |
| `uri` | TEXT NOT NULL | Путь к изображению |
| `created_at` | DATETIME | Дата создания |

Внешний ключ настроен с `ON DELETE CASCADE` — при удалении маркера все связанные изображения удаляются автоматически.

## Подход к обработке ошибок

Обработка ошибок реализована на нескольких уровнях:

1. **Уровень инициализации** — ошибки при открытии и создании таблиц БД перехватываются в `database/schema.ts` и передаются через контекст.
2. **Уровень операций** — каждая CRUD-операция в `database/operations.ts` обёрнута в `try/catch` с логированием в режиме разработки (`__DEV__`).
3. **Уровень контекста** — `DatabaseContext` хранит состояние `error: Error | null`, которое обновляется при любой ошибке операции.
4. **Уровень UI** — компоненты подписываются на `error` из контекста и показывают `Alert` пользователю.

## Структура проекта

```
expo1/
├── app/
│   ├── _layout.tsx          # Корневой layout с DatabaseProvider
│   ├── index.tsx            # Экран карты
│   └── marker/
│       └── [id].tsx         # Экран деталей маркера
├── components/
│   ├── Map.tsx
│   ├── MarkerList.tsx
└─── ImageList.tsx
├── contexts/
│   └── DatabaseContext.tsx  # React Context для БД
├── database/
│   ├── schema.ts            # Инициализация и схема БД
│   └── operations.ts        # CRUD-операции
├── types.ts
└── package.json
```
