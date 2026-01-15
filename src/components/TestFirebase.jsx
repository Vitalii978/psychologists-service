import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { ref, get, query, orderByKey, limitToLast } from 'firebase/database';

const TestFirebase = () => {
  const [status, setStatus] = useState('Проверяем...');
  const [realTimeData, setRealTimeData] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔄 Начинаем проверку...');

        // Способ 1: Читаем с принудительным обновлением
        const psychRef = ref(db, 'psychologists');

        // Добавляем параметры для обхода кэша
        const psychQuery = query(
          psychRef,
          orderByKey(),
          limitToLast(50) // Берем последние 50 записей
        );

        const snapshot = await get(psychQuery);

        console.log('📊 Snapshot существует?', snapshot.exists());
        console.log('📊 Количество детей:', snapshot.size || 'N/A');

        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('📦 РАЗБИРАЕМ ДАННЫЕ:');
          console.log('- Тип данных:', typeof data);
          console.log('- Количество ключей:', Object.keys(data).length);

          // Проверяем каждый ключ
          Object.keys(data).forEach(key => {
            const value = data[key];
            console.log(
              `  Ключ ${key}:`,
              value ? `тип ${typeof value}, есть данные` : 'NULL или пусто'
            );
          });

          const ids = Object.keys(data);
          setRealTimeData({
            count: ids.length,
            ids: ids,
            has0: data['0'] !== undefined && data['0'] !== null,
            has31: data['31'] !== undefined && data['31'] !== null,
            rawData: data,
          });

          setStatus(`✅ Psychologists: ${ids.length} записей`);
        } else {
          setStatus('❓ Psychologists пусто');
          setRealTimeData({ count: 0, ids: [] });
        }
      } catch (error) {
        console.error('🔥 ОШИБКА:', error);
        setStatus(`❌ Ошибка: ${error.code} - ${error.message}`);
      }
    };

    // Запускаем проверку несколько раз с задержкой
    testConnection();
    const interval = setInterval(testConnection, 3000); // Каждые 3 секунды

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Проверка в реальном времени</h2>

      <div
        style={{
          background: '#e9ecef',
          padding: '15px',
          borderRadius: '5px',
          margin: '15px 0',
          fontFamily: 'monospace',
        }}
      >
        <div>
          <strong>Статус:</strong> {status}
        </div>
        <div>
          <strong>Время:</strong> {new Date().toLocaleTimeString()}
        </div>
        <button
          onClick={() => window.location.reload(true)}
          style={{ marginTop: '10px', padding: '5px 10px' }}
        >
          🔄 Жесткая перезагрузка
        </button>
      </div>

      {realTimeData && (
        <div>
          <h3>Результаты:</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {/* Левая колонка - статистика */}
            <div
              style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '5px',
              }}
            >
              <h4>Статистика</h4>
              <div>
                Всего записей: <strong>{realTimeData.count}</strong>
              </div>
              <div>
                ID 0:{' '}
                <span
                  style={{
                    color: realTimeData.has0 ? 'red' : 'green',
                    fontWeight: 'bold',
                  }}
                >
                  {realTimeData.has0 ? 'ЕСТЬ ❌' : 'НЕТ ✅'}
                </span>
              </div>
              <div>
                ID 31:{' '}
                <span
                  style={{
                    color: realTimeData.has31 ? 'red' : 'green',
                    fontWeight: 'bold',
                  }}
                >
                  {realTimeData.has31 ? 'ЕСТЬ ❌' : 'НЕТ ✅'}
                </span>
              </div>
            </div>

            {/* Правая колонка - ID */}
            <div
              style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '5px',
              }}
            >
              <h4>ID психологов ({realTimeData.ids.length})</h4>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {realTimeData.ids.map(id => (
                  <span
                    key={id}
                    style={{
                      background:
                        id === '0' || id === '31' ? '#ffcccc' : '#d4edda',
                      padding: '5px 10px',
                      borderRadius: '3px',
                      fontSize: '14px',
                    }}
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Сырые данные для отладки */}
          <details style={{ marginTop: '20px' }}>
            <summary>Показать сырые данные (для отладки)</summary>
            <pre
              style={{
                background: '#2d2d2d',
                color: '#f8f8f8',
                padding: '15px',
                borderRadius: '5px',
                overflow: 'auto',
                maxHeight: '300px',
                fontSize: '12px',
                marginTop: '10px',
              }}
            >
              {JSON.stringify(realTimeData.rawData, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Инструкция по очистке кэша */}
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '5px',
        }}
      >
        <h4>🔄 Если данные не обновляются:</h4>
        <ol>
          <li>
            <strong>Chrome/Firefox:</strong> Ctrl+Shift+R (жесткая перезагрузка)
          </li>
          <li>
            <strong>Открой DevTools (F12) → Network</strong>
          </li>
          <li>
            <strong>Поставь галочку "Disable cache"</strong>
          </li>
          <li>
            <strong>Обнови страницу</strong>
          </li>
          <li>
            <strong>Или открой в режиме инкогнито</strong> (Ctrl+Shift+N)
          </li>
        </ol>
      </div>
    </div>
  );
};

export default TestFirebase;
