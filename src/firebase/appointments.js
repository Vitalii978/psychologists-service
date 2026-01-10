// ============================================
// ФАЙЛ: src/firebase/appointments.js
// ФУНКЦИИ ДЛЯ СОХРАНЕНИЯ ЗАЯВОК НА ПРИЕМ
// ============================================

import { ref, push, set } from 'firebase/database';
import { db } from './config';

/**
 * Сохраняет заявку на прием к психологу
 * @param {Object} appointmentData - Данные заявки
 * @param {string} psychologistId - ID психолога
 * @param {string} userId - ID пользователя (если авторизован)
 * @returns {Object} - Результат операции
 */
export const saveAppointment = async (appointmentData, psychologistId, userId = null) => {
  try {
    // Создаем уникальный ID для заявки
    const appointmentsRef = ref(db, 'appointments');
    const newAppointmentRef = push(appointmentsRef);
    
    // Подготовка данных для сохранения
    const appointmentToSave = {
      ...appointmentData,
      psychologistId: psychologistId,
      status: 'pending', // Статус: pending, confirmed, cancelled
      createdAt: new Date().toISOString()
    };
    
    // Если пользователь авторизован - сохраняем его ID
    if (userId) {
      appointmentToSave.userId = userId;
    }
    
    // Сохраняем в Firebase
    await set(newAppointmentRef, appointmentToSave);
    
    return { 
      success: true, 
      appointmentId: newAppointmentRef.key 
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Получает заявки пользователя (заглушка для будущего использования)
 * @returns {Object} - Результат с массивом заявок
 */
export const getUserAppointments = async () => {
  // Функция-заглушка для будущего расширения
  // В будущем здесь будет запрос к Firebase для получения заявок пользователя
  return { success: true, appointments: [] };
};