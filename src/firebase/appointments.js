import { ref, push, set } from 'firebase/database';
import { db } from './config';

/**
 * Сохраняет заявку на прием к психологу
 * @param {Object} appointmentData - Данные заявки
 * @param {string} psychologistId - ID психолога
 * @param {string} userId - ID пользователя (если авторизован)
 * @returns {Object} - Результат операции
 */
export const saveAppointment = async (
  appointmentData,
  psychologistId,
  userId = null
) => {
  try {
    const appointmentsRef = ref(db, 'appointments');
    const newAppointmentRef = push(appointmentsRef);

    const appointmentToSave = {
      ...appointmentData,
      psychologistId: psychologistId,
      status: 'pending', 
      createdAt: new Date().toISOString(),
    };

    if (userId) {
      appointmentToSave.userId = userId;
    }

    await set(newAppointmentRef, appointmentToSave);

    return {
      success: true,
      appointmentId: newAppointmentRef.key,
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
